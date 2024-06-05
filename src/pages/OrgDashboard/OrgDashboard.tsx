import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelModule from "../../organisms/AdminPanel/AdminPanel.module";

import { Calendar, Modal, Button, Input, Table, Nav, Navbar } from "rsuite";
import ExitIcon from '@rsuite/icons/Exit';
import { ToastContainer, toast } from "react-toastify";
import "./OrgDashboard.scss";

type Application = {
  approvedDate: string;
  createdDate: string;
  email: string;
  orgName: string;
  reason: string;
  status: number;
  _id: string;
};

export default function OrgDashboard() {
  const [date, setDate] = useState(new Date());
  const { Column, HeaderCell, Cell } = Table;

  const navigate = useNavigate();
  const userEmail = Cookies.get("email");
  const orgValue = Cookies.get("organizationValue");

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [allApplication, setAllApplication] = useState<Application[]>([]);

  const [totalLeavesAvailed, setTotalLeaveAvailed] = useState(0);
  const [orgData, setOrgData] = useState({
    isActive: true,
    name: "",
    max_wfh: 0,
    userEmail: [],
    admin: ""
  })

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectedDate = (date: Date) => {

    if (totalLeavesAvailed >= orgData.max_wfh) {
      toast.error("You have used all your leave!!");
      return;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = date.setHours(0, 0, 0, 0);
    if (selectedDate >= today && !isDateAlreadyApplied(date)) {
      setSelectedDate(new Date(date));
      handleOpen();
    } else if (isDateAlreadyApplied(date)) {
      toast.info("Application already exists for this date.");
    }
  };

  const leaveApplication = async () => {
    if(!reason || reason === ""){
      toast.error("Reason is required.");
      return ;
    }
    const URL = "http://localhost:5000/application";
    selectedDate?.setHours(0, 0, 0, 0);
    try {
      const resp = await axios.post(URL, {
        email: userEmail,
        createdDate: selectedDate,
        orgName: orgValue,
        reason: reason,
      });
      toast.success("Application submitted successfully");
      getUserApplications();
      setReason("");
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error("Error submiting the application");
    }
  };


  const checkAdmin = async () => {
    const URL = `http://localhost:5000/admin?email=${userEmail}&orgName=${orgValue}`;
    try {
      const response = await axios.get(URL);
      setIsAdmin(response.data.isAdmin);
      if (!response.data.isAdmin) {
        getOrganizationData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const disablePastDates = (date: Date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const checkingDate = date.setHours(0, 0, 0, 0);
    return checkingDate < today;
  };

  const setCellClassName = (date: Date): string | undefined => {
    if (allApplication && allApplication.length > 0) {
      for (let i = 0; i < allApplication.length; i++) {
        const matchedDate = new Date(allApplication[i].createdDate);
        if (
          matchedDate.getDate() === date.getDate() &&
          matchedDate.getMonth() === date.getMonth()
        ) {
          const status = allApplication[i].status;

          if (status === 0) return "completed";
          else if (status === 1) return "rejected";
          else if (status === 2) return "pending";
          else return "";
        }
      }
    }
  };

  const isDateAlreadyApplied = (date: Date) => {
    return allApplication && allApplication.length > 0 && allApplication.some(application => {
      const appliedDate = new Date(application.createdDate).setHours(0, 0, 0, 0);
      return appliedDate === date.setHours(0, 0, 0, 0);
    });
  };

  const getUserApplications = async () => {
    const URL = `http://localhost:5000/user-applications`;
    try {

      const response = await axios.get(`${URL}?email=${userEmail}&orgName=${orgValue}`);

      setAllApplication(response.data.applications);
      if (response.data.applications) {
        let count = 0;
        response.data.applications.forEach((el: Application) => {

          const matchedDate = new Date(el.createdDate);

          if (matchedDate.getMonth() === date.getMonth())
            if (el.status === 0 || el.status === 2)
              count += 1;
        })
        setTotalLeaveAvailed(count)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getOrganizationData = async () => {
    const URL = `http://localhost:5000/organization/data`;
    try {

      const response = await axios.get(`${URL}?orgName=${orgValue}`);
      setOrgData(response.data.organization)
    } catch (err) {
      console.log(err);
    }
  };

  const checkWfhLeaves = async (event: Date) => {

    const newMonth = event.getMonth();
    const newYear = event.getFullYear();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    if (newMonth !== currentMonth || newYear !== currentYear) {
      setDate(event);
    }
  }

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const type = Cookies.get('type');
    if (!token && type==="orguser") navigate('/');
  }, [])

  useEffect(() => {
    checkAdmin();
  }, [])

  useEffect(()=>{
    getUserApplications();
  },[date])


  return (
    <>
      {isAdmin ? (
        <AdminPanelModule orgName={orgValue} userEmail={userEmail} />
      ) : (
        <>
          <Navbar>
            <Navbar.Brand ><b>Organization User Dashboard</b></Navbar.Brand>
            <Nav pullRight>
              <Nav.Item><label><b>Leavies Availed:</b>  {totalLeavesAvailed}/{orgData.max_wfh}</label></Nav.Item>
              <Nav.Item>
                {" "}
                <Button
                  startIcon={<ExitIcon />}
                  appearance="ghost"
                  color="red"
                  onClick={() => {
                    Cookies.remove("accessToken");
                    Cookies.remove("email");
                    Cookies.remove("organizationValue");
                    Cookies.remove("type");
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </Nav.Item>
            </Nav>

          </Navbar>

          <Calendar
            bordered
            compact
            onSelect={handleSelectedDate}
            disabledDate={disablePastDates}
            cellClassName={setCellClassName}
            onChange={checkWfhLeaves}
          />
          <div>
            <h4 style={{ textAlign: "center" }}>All Leaves of User</h4>
          </div>
          {/* Leave Application Table */}
          <Table height={420} style={{ marginTop: 10 }} data={allApplication}>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Leave Date</b>
              </HeaderCell>
              <Cell dataKey="createdDate">
                {(rowData) =>
                  new Date(rowData.createdDate).toLocaleString().split(",")[0]
                }
              </Cell>
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Leave Reason</b>
              </HeaderCell>
              <Cell dataKey="reason" />
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Status</b>
              </HeaderCell>
              <Cell>{(rowData) => { if (rowData.status === 2) return <label style={{ color: "grey" }}>Pending</label>; else if (rowData.status === 0) return <label style={{ color: "green" }}>Approved</label>; else return <label style={{ color: "red" }}>Rejected</label> }}</Cell>
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Updated By</b>
              </HeaderCell>
              <Cell dataKey="approvedBy" />
            </Column>
            <Column width={250} resizable>
              <HeaderCell>
                <b>Any Rejected Reason</b>
              </HeaderCell>
              <Cell dataKey="rejectedReason" />
            </Column>
          </Table>
        </>
      )}

      {/* Apply Leave Modal */}
      <Modal overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <strong>Leave Application</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Reason for Leave :</label>
          <Input
            as="textarea"
            rows={3}
            onChange={(value: string | undefined) => {
              if (typeof value === "string") {
                setReason(value);
              }
            }}
            placeholder="Textarea"
            style={{ marginTop: "20px" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              leaveApplication();
            }}
            appearance="primary"
          >
            Submit
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
