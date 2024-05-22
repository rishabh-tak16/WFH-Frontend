import axios from "axios";
import { Cookies } from "react-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelModule from "../../organisms/AdminPanel/AdminPanel.module";

import { Calendar, Modal, Button, Input, Table } from "rsuite";
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
  const { Column, HeaderCell, Cell } = Table;

  const navigate = useNavigate();
  const cookies = new Cookies();
  const userEmail = cookies.get("email");
  const orgValue = cookies.get("organizationValue");

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [allApplication, setAllApplication] = useState<Application[]>([]);
  const [leaveCount, setLeaveCount] = useState(0);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectedDate = (date: Date) => {
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
    const URL = "http://localhost:5000/application";
    try {
      const resp = await axios.post(URL, {
        email: userEmail,
        createdDate: selectedDate,
        orgName: orgValue,
        reason: reason,
      });
      //console.log("Response from leaveapllication api", resp);
      toast.success("Application submitted successfully");
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
      toast.error("Error submiting the application");
    }
  };

  const checkAdmin = async () => {
    const URL = "http://localhost:5000/admin";
    try {
      const response = await axios.post(URL, {
        email: userEmail,
        orgName: orgValue,
      });
      setIsAdmin(response.data.isAdmin);
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
  };

  const isDateAlreadyApplied = (date: Date) => {
    return allApplication.some(application => {
      const appliedDate = new Date(application.createdDate).setHours(0, 0, 0, 0);
      return appliedDate === date.setHours(0, 0, 0, 0);
    });
  };

  const getUserApplications = async () => {
    const URL = `http://localhost:5000/user-application`;
    try {
      const application = await axios.post(URL, {
        email: userEmail,
        orgName: orgValue,
      });

      setAllApplication(application.data.applications);
      setLeaveCount(application.data.applications.length);
      setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = cookies.get('accessToken');
    if (!token) navigate('/');
    checkAdmin();
    getUserApplications();
  }, [updated]);

  return (
    <>
      <Button
        onClick={() => {
          cookies.remove("accessToken");
          cookies.remove("email");
          cookies.remove("organizationValue");
          navigate("/org-login");
        }}
      >
        Logout
      </Button>
      {isAdmin ? (
        <AdminPanelModule orgName={orgValue} userEmail={userEmail} />
      ) : (
        <>
          <Calendar
            bordered
            compact
            onSelect={handleSelectedDate}
            disabledDate={disablePastDates}
            cellClassName={setCellClassName}
          />
          <div>
            <h4>Total Leaves Applied: {leaveCount}</h4>
          </div>
          <Table height={420} style={{ marginTop: 10 }} data={allApplication}>
            <Column width={200} resizable>
              <HeaderCell>
                <b>Leave Date</b>
              </HeaderCell>
              <Cell dataKey="createdDate">
                {(rowData) =>
                  new Date(rowData.createdDate).toLocaleString().split(",")[0]
                }
              </Cell>
            </Column>

            <Column width={250} resizable>
              <HeaderCell>
                <b>Leave Reason</b>
              </HeaderCell>
              <Cell dataKey="reason" />
            </Column>
            <Column width={200} resizable>
              <HeaderCell>
                <b>Status</b>
              </HeaderCell>
              <Cell>{(rowData) => { if (rowData.status === 2) return "Pending"; else if (rowData.status === 0) return "Approved"; else return "Rejected" }}</Cell>
            </Column>
            <Column width={250} resizable>
              <HeaderCell>
                <b>Updated By</b>
              </HeaderCell>
              <Cell dataKey="approvedBy" />
            </Column>
            <Column width={250} resizable>
              <HeaderCell>
                <b>Rejected Reason</b>
              </HeaderCell>
              <Cell dataKey="rejectedReason" />
            </Column>


          </Table>
        </>
      )}

      <Modal overflow={true} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <h4>Leave Application</h4>
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
              handleClose();
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
