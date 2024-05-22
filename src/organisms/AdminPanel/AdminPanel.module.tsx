import React, { useEffect, useState } from "react";
import { Table, Button, ButtonGroup, Modal, Input } from "rsuite";
import axios from "axios";
const { Column, HeaderCell, Cell } = Table;

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
  orgName: string;
  userEmail: string;
};

function AdminPanel({ orgName, userEmail }: AdminProp) {
  const [updated, setUpdated] = useState(false);
  const [allApplication, setAllApplication] = useState<Application[]>([]);
  
  const [rejectReason, setRejectReason] = useState("");
  const [ID, setID] = useState("");
  const [rejectionReasonForm, setRejectionReasonForm] = useState(false);

  const handleClose = () => setRejectionReasonForm(false);

  const setValueRejectReason = (value: string) => {
    setRejectReason(value);
  };

  const getWfhApplications = async () => {
    const URL = `http://localhost:5000/all-application`;

    try {
      const application = await axios.post(URL, { orgName });

      setAllApplication(application.data.applications);
    } catch (err) {
      console.log(err);
    }
  };

  const leaveReq = async (status: number) => {
    if (ID === "" || !ID || rejectReason === "" || !rejectReason) {
      // toast.error("Fill all the details");
      return;
    }

    const URL = "http://localhost:5000/application/status";

    try {
      const api = await axios.put(
        URL,
        { _id: ID, statusValue: status, userEmail, rejectedReason: rejectReason }
      );

      console.log(api.data);
      setUpdated(!updated)
      
    } catch (err) {
      console.log(err);
    }

    setRejectReason("")
    setID("")
    handleClose();
  };

  useEffect(() => {
    getWfhApplications();
  }, [updated]);

  return (
    <>
      <div>
        <h3>Hello Admin of {orgName}</h3>

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
                        leaveReq(0);
                      }}
                      appearance="ghost"
                      active
                      style={{ padding: "3px 5px" }}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        setID(rowData._id)
                        setRejectionReasonForm(true)
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
                      <>Leave Approved</>
                    ) : (
                      <>Leave Rejected </>
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
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>{leaveReq(1)}} appearance="primary" active>
            Submit
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
}

export default AdminPanel;
