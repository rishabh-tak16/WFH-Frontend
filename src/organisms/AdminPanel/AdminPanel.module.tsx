import React, { useEffect, useState } from "react";
import { Table, Button, ButtonGroup, Modal, Input, SelectPicker, Nav,Navbar } from "rsuite";
import ExitIcon from '@rsuite/icons/Exit';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ModalHeader from "rsuite/esm/Modal/ModalHeader";
import ModalBody from "rsuite/esm/Modal/ModalBody";
import ModalFooter from "rsuite/esm/Modal/ModalFooter";
import FunnelIcon from '@rsuite/icons/Funnel';
import { toast } from "react-toastify";

type Application = {
  approvedDate: string;
  createdDate: string;
  email: string;
  orgName: string;
  reason: string;
  status: number;
  _id: string;
};

type AdminProp = {
  orgName: string | undefined;
  userEmail: string | undefined;
};

function AdminPanel({ orgName, userEmail }: AdminProp) {
  const { Column, HeaderCell, Cell } = Table;
  const [allApplication, setAllApplication] = useState<Application[]>([]);

  //states for filter
  const [filterEmail, setFilterEmail] = useState("");
  const [filterReason, setFilterReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | number | null>(null);
  const [filterApprovedBy, setFilterApprovedBy] = useState("");
  const [filterAvailedAt, setFilterAvailedAt] = useState<Date|null|string>();

  const [rejectReason, setRejectReason] = useState("");
  const [ID, setID] = useState("");
  const [rejectionReasonForm, setRejectionReasonForm] = useState(false);
  const [FilterModal, setFilterModal] = useState(false);

  const handleClose = () => setRejectionReasonForm(false);
  const closeFilterModal = () => setFilterModal(false);

  const navigate = useNavigate();

  const setValueRejectReason = (value: string) => {
    setRejectReason(value);
  };

  const getWfhApplicationsFiltered = async () => {
    const URL = `http://localhost:5000/all-application/${orgName}/filter?email=${filterEmail}&reason=${filterReason}&status=${filterStatus}&approvedBy=${filterApprovedBy}&createdDate=${filterAvailedAt}`;
    console.log("filterDAte>>>>",filterAvailedAt);
    
    try {
      const application = await axios.get(URL);
      setAllApplication(application.data.applications);
    } catch (err) {
      console.log(err);
    }
    setFilterEmail("");
    setFilterReason("");
    setFilterApprovedBy("");
    setFilterStatus("");
    setFilterAvailedAt(null);
  };

  const statusOptions = [
    { label: "Pending", value: 2 },
    { label: "Approved", value: 0 },
    { label: "Rejected", value: 1 },
  ];

  const leaveReq = async (status: number,ID: string = "") => {
    if (ID === "" || !ID) {
      console.log("Error in leavReq>>>", ID);
      return;
    }

    if(status === 1 && rejectReason === "") {
      toast.error("Reason is required");
      return ;
    }

    const URL = "http://localhost:5000/application/status";

    try {
      const api = await axios.put(URL, {
        _id: ID,
        statusValue: status,
        userEmail,
        rejectedReason: rejectReason,
      });

    } catch (err) {
      console.log(err);
    }

    setRejectReason("");
    setID("");
    handleClose();
    getWfhApplicationsFiltered();
  };

  useEffect(() => {    
    getWfhApplicationsFiltered();
  }, []);

  return (
    <>
      <div>
      <Navbar>
        <Navbar.Brand >Admin Dashboard - {orgName}</Navbar.Brand>
          <Nav pullRight>
          <Nav.Item>
          <Button
          startIcon={<FunnelIcon/>}
            onClick={() => {
              setFilterModal(true);
            }}
          >
            Filter
          </Button>
          </Nav.Item>
          <Nav.Item>
          <Button
            onClick={() => {
              setFilterEmail("");
              setFilterApprovedBy("");
              setFilterStatus("");
              setFilterReason("");
              getWfhApplicationsFiltered();
            }}
          >
            Remove Filter
          </Button>
          </Nav.Item>
          <Nav.Item>
            {" "}
            <Button
              startIcon={<ExitIcon/>}
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

        <Table data={allApplication} autoHeight={true}>
          <Column flexGrow={1} align="center" resizable={true}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" className="overflowContent" />
          </Column>
          <Column flexGrow={1} align="center">
            <HeaderCell>Availed At</HeaderCell>
            <Cell dataKey="createdDate">
              {(rowData) =>
                new Date(rowData.createdDate).toLocaleString().split(",")[0]
              }
            </Cell>
          </Column>
          <Column flexGrow={1} align="center" resizable={true}>
            <HeaderCell>Reason</HeaderCell>
            <Cell dataKey="reason" className="overflowContent" />
          </Column>
          <Column align="center" flexGrow={1} resizable={true}>
            <HeaderCell>Status</HeaderCell>
            <Cell style={{ padding: "6px" }}>
              {(rowData) =>
                rowData.status === 2 ? (
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        setID(rowData._id);
                        leaveReq(0,rowData._id);
                        // getWfhApplicationsFiltered();
                      }}
                      appearance="ghost"
                      active
                      style={{ padding: "3px 5px" }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        setID(rowData._id);
                        setRejectionReasonForm(true);
                      }}
                      appearance="ghost"
                      active
                      style={{ padding: "3px 5px" }}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                ) : (
                  <>
                    {rowData.status === 0 ? (
                      <><label style={{color:"Green"}}>Approved</label></>
                    ) : (
                      <><label style={{color:"Red"}}>Rejected</label></>
                    )}
                  </>
                )
              }
            </Cell>
          </Column>
          <Column flexGrow={1} align="center" resizable={true}>
            <HeaderCell>Updated By</HeaderCell>
            <Cell dataKey="approvedBy" className="overflowContent" />
          </Column>
        </Table>
      </div>

      <Modal overflow={true} open={rejectionReasonForm} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-body">
            Reason
            <Input
              type={"text"}
              onChange={setValueRejectReason}
              style={{ marginBottom: 10 }}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              leaveReq(1,ID);
            }}
            appearance="primary"
            active
          >
            Submit
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={FilterModal} onClose={closeFilterModal} size={"xs"}>
        <ModalHeader>
          <Modal.Title>Filter</Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Filter specific Email"
            type={"email"}
            onChange={(value) => {
              setFilterEmail(value);
            }}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder="Filter Reason"
            type={"text"}
            onChange={(value) => {
              setFilterReason(value);
            }}
            style={{ marginBottom: 10 }}
          />
          <SelectPicker
            placeholder="Filter Status"
            data={statusOptions}
            onChange={(value) => {
              setFilterStatus(value);
            }}
            style={{ marginBottom: 10, width: "100%" }}
          />
          <Input
            placeholder="Filter Updated By"
            type={"email"}
            onChange={(value) => {
              setFilterApprovedBy(value);
            }}
            style={{ marginBottom: 10 }}
          />
          <Input
          type="date"
          onChange={(value) => {
            setFilterAvailedAt(value);
          }}
          style={{ marginBottom: 10 }}
          />

        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              closeFilterModal();
              getWfhApplicationsFiltered();
            }}
            appearance="primary"
            active
          >
            Apply
          </Button>
          <Button onClick={closeFilterModal} appearance="subtle">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default AdminPanel;
