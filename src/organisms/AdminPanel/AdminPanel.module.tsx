import React, { useEffect, useState } from "react";
import { Table, Button, ButtonGroup, Modal, Input, SelectPicker } from "rsuite";
import axios from "axios";
import ModalHeader from "rsuite/esm/Modal/ModalHeader";
import ModalBody from "rsuite/esm/Modal/ModalBody";
import ModalFooter from "rsuite/esm/Modal/ModalFooter";

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
  const [isLoading, setIsLoading] = useState(false);

  //states for filter
  const [filterEmail, setFilterEmail] = useState("");
  const [filterReason, setFilterReason] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | number | null>(null);
  const [filterApprovedBy, setFilterApprovedBy] = useState("");

  const [rejectReason, setRejectReason] = useState("");
  const [ID, setID] = useState("");
  const [rejectionReasonForm, setRejectionReasonForm] = useState(false);
  const [FilterModal, setFilterModal] = useState(false);

  const handleClose = () => setRejectionReasonForm(false);
  const closeFilterModal = () => setFilterModal(false);

  const setValueRejectReason = (value: string) => {
    setRejectReason(value);
  };

  const getWfhApplicationsFiltered = async () => {
    const URL = `http://localhost:5000/all-application/${orgName}/filter?email=${filterEmail}&reason=${filterReason}&status=${filterStatus}&approvedBy=${filterApprovedBy}`;
    console.log(URL);
    
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

    const URL = "http://localhost:5000/application/status";

    try {
      const api = await axios.put(URL, {
        _id: ID,
        statusValue: status,
        userEmail,
        rejectedReason: rejectReason,
      });

      console.log(api.data);
    } catch (err) {
      console.log(err);
    }

    setRejectReason("");
    setID("");
    handleClose();
  };

  useEffect(() => {    
    getWfhApplicationsFiltered();
    setIsLoading(false);
  }, [isLoading]);

  return (
    <>
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h3>Hello Admin of {orgName}</h3>
          <Button
            onClick={() => {
              setFilterModal(true);
            }}
            style={{ marginLeft: 30 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              setFilterEmail("");
              setFilterApprovedBy("");
              setFilterStatus("");
              setFilterReason("");
              getWfhApplicationsFiltered();
            }}
            style={{ marginLeft: 30 }}
          >
            Remove Filter
          </Button>
            
        </div>
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
                        setIsLoading(true);
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
              setIsLoading(true);
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

      <Modal open={FilterModal} onClose={closeFilterModal}>
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
                    {/* <Input
            placeholder="Filter Availed By"
            type={"date"}
            // onChange={(value) => {
            // }}
            style={{ marginBottom: 10 }}
          /> */}

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
