import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Table,
  SelectPicker,
  Button,
  Modal,
  Whisper,
  Tooltip,
  Input,
  Navbar,
  Nav,
  InputNumber,
} from "rsuite";
import { useState, useEffect } from "react";
import ExitIcon from "@rsuite/icons/Exit";

import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from "@rsuite/icons/Plus";
import { ToastContainer, toast } from "react-toastify";

const { Column, HeaderCell, Cell } = Table;

interface Organization {
  _id: string;
  name: string;
  max_wfh: number;
  admin: string;
}

export default function SysDashboard() {
  const navigate = useNavigate();
  const [organizationValue, setOrganizationValue] = useState("");
  const [useremail, setuseremail] = useState("");
  const [username, setUsername] = useState("");
  const [modalId, setModalId] = useState([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [wfhDays, setWfhDays] = useState<null | number>();
  const [newOrgName, setNewOrgName] = useState("");
  const [showUserTable, setShowUserTable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [maxwfhError, setMaxwfhError] = useState("");

  const [orgId, setOrgId] = useState();
  const [editOrgName, setEditOrgName] = useState("");
  const [newWfhDays, setNewWfhDays] = useState<string | null | number>(0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const openDeleteModal = () => setDeleteOpen(true);
  const closeDeleteModal = () => setDeleteOpen(false);

  const [openCreate, setOpenCreate] = useState(false);
  const openCreateModal = () => setOpenCreate(true);
  const closeCreateModal = () => setOpenCreate(false);

  const [openOrgCreate, setOpenOrgCreate] = useState(false);
  const openOrgCreateModal = () => setOpenOrgCreate(true);
  const closeOrgCreateModal = () => setOpenOrgCreate(false);

  const [openEdit, setOpenEdit] = useState(false);
  const openEditModal = () => setOpenEdit(true);
  const closeEditModal = () => setOpenEdit(false);
  const [users, setUsers] = useState([]);

  const [organizationName, setOrganizationName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dob, setDOB] = useState("");
  const [doj, setDOJ] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {}, []);

  useEffect(() => {
    const token: string | undefined = Cookies.get("accessToken");
    const type = Cookies.get("type");
    if (!token || type !== "sysuser") navigate("/");
    if (typeof token === "string") {
      SystemUserDashBoardRequest();
      AllOrganization();
      setIsLoading(false);
    }
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const AllOrganization = async () => {
    const URL = "http://localhost:5000/organization";
    try {
      const response = await axios.get(URL);

      setOrganizations(response.data.organizations);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (
      !organizationName ||
      !firstName ||
      !lastName ||
      !email ||
      !dob ||
      !doj
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid Email Format");
      return;
    }
    setEmailError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/orguser-register",
        { organizationName, firstName, lastName, email, dob, doj }
      );
      toast.success("User registered Sucessfully");
      closeOrgCreateModal();
      SystemUserDashBoardRequest();
    } catch (error: any) {
      toast.error(error);
      console.error("Error submitting form:", error.response.data.msg);
    }
  };

  const RegisterOrganization = async () => {
    if (!newOrgName || !wfhDays || newOrgName === "") {
      toast.error("All fields are required.");
      return;
    }
    if (wfhDays > 31) {
      setMaxwfhError("Maximum work from home days cannot exceed 31.");
      return;
    }
    setMaxwfhError("");
    const URL = "http://localhost:5000/org-register";
    try {
      await axios.post(URL, { name: newOrgName, max_wfh: wfhDays });
      toast.success("User registered Sucessfully");
      closeCreateModal();
      AllOrganization();
      setNewOrgName("");
      setNewWfhDays(0);
    } catch (err) {
      console.log(err);
      toast.error("Organization name already exists");
    }
  };

  const SystemUserDashBoardRequest = async () => {
    const URL = "http://localhost:5000/sysuser-dashboard";

    try {
      const get_dashboard_api = await axios.get(URL);
      const response = get_dashboard_api.data;
      setUsers(response.user_data);
      return response;
    } catch (err) {
      console.error(err);
      return "DashBoard Error";
    }
  };

  const deliveOrganization = async (_id: string) => {
    if (!_id) {
      return;
    }
    const URL = "http://localhost:5000/delete-org";

    try {
      const api = await axios.put(URL, { _id });
      AllOrganization();
    } catch (err) {
      console.log(err);
    }
  };

  const editOrganization = async () => {

    if (!orgId) {
      return;
    }
    if(!editOrgName || editOrgName===""){
      toast.error("Organization name cannot be empty");
      return;
    }
    const URL = "http://localhost:5000/update-org";
    try {
      const api = await axios.put(URL, {
        _id: orgId,
        orgName: editOrgName,
        max_wfh: newWfhDays,
      });
      setEditOrgName("");
      setNewWfhDays(0)
      AllOrganization();
      closeEditModal();
    } catch (err) {
      console.log(err);
    }
  };

  const makeadmin = async (email: string) => {
    if(!organizationValue || organizationValue===""){
      toast.error("Please select Organization")
      return ;
    }
    const token: string | undefined = Cookies.get("accessToken");
    const URL = "http://localhost:5000/org-admin";
    const payload = {
      email: email,
      orgName: organizationValue,
    };
    setOrganizationValue("");
    setUsername("");
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: `BEARER ${token}`,
      };
      const post_admin_api = await axios.post(URL, payload, {
        headers,
      });
      const response = post_admin_api.data;
      toast.success(response.msg);
      handleClose();
      AllOrganization()

    } catch (err) {
      console.log(err);
      return "DashBoard Error";
    }
  };

  const deleteUser = async (email: string) => {
    if(organizationValue===""){
      toast.error("Please select Organization");
      return ;
    }

    const token: string | undefined = Cookies.get("accessToken");
    const URL = "http://localhost:5000/orguser-delete";
    const payload = {
      email: email,
      organizationValue: organizationValue,
    };
    setOrganizationValue("");
    setUsername("");
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: `BEARER ${token}`,
      };
      const post_deleteuser_api = await axios.post(URL, payload, {
        headers,
      });
      const response = post_deleteuser_api.data;
      toast.success("User deleted Successfully....");
      closeDeleteModal();
      SystemUserDashBoardRequest();
    } catch (err) {
      console.log(err);
      return "DashBoard Error";
    }
  };

  return (
    <>
      <Navbar>
        <Navbar.Brand>
          <b>System Dashboard</b>
        </Navbar.Brand>
        <Nav>
          <Nav.Item onClick={openCreateModal} icon={<PlusIcon />}>
            Create Organization
          </Nav.Item>
          <Nav.Item onClick={openOrgCreateModal} icon={<PlusIcon />}>
            Create User
          </Nav.Item>
          <Nav.Item onClick={() => setShowUserTable(!showUserTable)}>
            {showUserTable ? "Show Organizations" : "Show Users"}
          </Nav.Item>
        </Nav>
        <Nav pullRight>
          <Nav.Item>
            {" "}
            <Button
              startIcon={<ExitIcon />}
              appearance="ghost"
              color="red"
              onClick={() => {
                Cookies.remove("accessToken");
                Cookies.remove("type");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Nav.Item>
        </Nav>
      </Navbar>

      <div></div>
      <div>
        {/* All Organizations User Table*/}
        {showUserTable ? (
          <Table height={600} style={{ marginTop: 30 }} data={users}>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>First Name</b>
              </HeaderCell>
              <Cell dataKey="firstName" />
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Last Name</b>
              </HeaderCell>
              <Cell dataKey="lastName" />
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Email</b>
              </HeaderCell>
              <Cell dataKey="email" />
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Date of Joining</b>
              </HeaderCell>
              <Cell dataKey="doj">
                {(rowData) =>
                  new Date(rowData.doj).toLocaleString().split(",")[0]
                }
              </Cell>
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Date of Birth </b>
              </HeaderCell>
              <Cell dataKey="dob">
                {(rowData) =>
                  new Date(rowData.dob).toLocaleString().split(",")[0]
                }
              </Cell>
            </Column>

            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Organization</b>
              </HeaderCell>
              <Cell dataKey="organization_list">
                {(rowData) => {
                  const orgs = rowData.organization_list;
                  if (orgs.length < 2) {
                    return <span>{orgs.join(", ")}</span>;
                  } else {
                    const displayOrgs = orgs.slice(0, 2).join(", ");
                    const tooltipOrgs = orgs.join(", ");
                    return (
                      <Whisper
                        trigger="hover"
                        placement="top"
                        speaker={<Tooltip>{tooltipOrgs}</Tooltip>}
                      >
                        <span>{`${displayOrgs}...`}</span>
                      </Whisper>
                    );
                  }
                }}
              </Cell>
            </Column>

            <Column flexGrow={2} align="center">
              <HeaderCell align="center">
                <b>Action</b>{" "}
              </HeaderCell>
              <Cell style={{ padding: "6px" }}>
                {(rowData) => (
                  <>
                    <Button
                      appearance="ghost"
                      onClick={() => {
                        setModalId(rowData.organization_list);
                        setuseremail(rowData.email);
                        setUsername(rowData.firstName);
                        handleOpen();
                      }}
                    >
                      Make Admin
                    </Button>
                    <TrashIcon
                      style={{
                        fontSize: "2em",
                        color: "red",
                        marginLeft: "30px",
                      }}
                      onClick={() => {
                        setModalId(rowData.organization_list);
                        setuseremail(rowData.email);
                        setUsername(rowData.firstName);
                        openDeleteModal();
                      }}
                    />
                  </>
                )}
              </Cell>
            </Column>
          </Table>
        ) : (
          <Table
            height={600}
            style={{ marginTop: 30, marginLeft: 10 }}
            data={organizations}
          >
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Organization Name</b>
              </HeaderCell>
              <Cell dataKey="name" />
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Maximum WFH</b>
              </HeaderCell>
              <Cell dataKey="max_wfh" />
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell>
                <b>Admin</b>
              </HeaderCell>
              <Cell dataKey="admin" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell align="center">
                <b>Action</b>
              </HeaderCell>
              <Cell align="center" style={{ padding: "6px" }}>
                {(rowData) => (
                  <>
                    <span>
                      <Whisper
                        placement="bottom"
                        trigger="hover"
                        speaker={<Tooltip> Edit </Tooltip>}
                      >
                        <EditIcon
                          style={{ cursor: "pointer", fontSize: "24" }}
                          color="blue"
                          onClick={() => {
                            openEditModal();
                            setOrgId(rowData._id);
                            setEditOrgName(rowData.name);
                            setNewWfhDays(rowData.max_wfh);
                          }}
                        />
                      </Whisper>
                    </span>
                    <span>
                      <Whisper
                        placement="bottom"
                        trigger="hover"
                        speaker={<Tooltip> Delete Organization</Tooltip>}
                      >
                        <TrashIcon
                          style={{
                            fontSize: "2em",
                            color: "red",
                            marginLeft: "50px",
                          }}
                          onClick={() => {
                            deliveOrganization(rowData._id);
                            setIsLoading(true);
                          }}
                        />
                      </Whisper>
                    </span>
                  </>
                )}
              </Cell>
            </Column>
          </Table>
        )}
      </div>

      {/* Make Admin Modal*/}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
        <Modal.Title style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: 10 }}
          >
            Admin Panel
          </div>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label style={{ paddingLeft: "80px" }}>
            Select Organization for which you want to make him admin
          </label>
          <br />
          <SelectPicker
            style={{ width: "450px", marginLeft: "50px", marginTop: "20px" }}
            onChange={(value: string | undefined | void | null) => {
              if (typeof value === "string") {
                setOrganizationValue(value);
              }
              console.log(value);
            }}
            data={modalId.map((org: string) => ({
              label: org,
              value: org,
            }))}
          ></SelectPicker>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              makeadmin(useremail);
            }}
            appearance="primary"
          >
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="ghost">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={closeDeleteModal}>
        <Modal.Header>
          <Modal.Title style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
              Delete Panel
            </div>
            <br /> User : {username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label style={{ paddingLeft: "70px" }}>
            Select Organization for which you want him to deleted from{" "}
          </label>
          <br />
          <SelectPicker
            style={{ width: "450px", marginLeft: "50px", marginTop: "20px" }}
            onChange={(value: string | undefined | void | null) => {
              if (typeof value === "string") {
                setOrganizationValue(value);
              }
              console.log(value);
            }}
            data={modalId.map((org: string) => ({
              label: org,
              value: org,
            }))}
          ></SelectPicker>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              deleteUser(useremail);
            }}
            color="red"
            appearance="primary"
          >
            Delete
          </Button>
          <Button onClick={closeDeleteModal} appearance="ghost" color="red">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create OrgUser Modal */}
      <Modal open={openOrgCreate} onClose={closeOrgCreateModal} size={"xs"}>
        <Modal.Title style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.2em", fontWeight: "bold", marginBottom: 10 }}
          >
            Create User
          </div>
        </Modal.Title>
        <Modal.Body>
          <div>
            <label>Organisation Name: </label>
            <SelectPicker
              data={organizations.map((org) => ({
                label: org.name,
                value: org.name,
              }))}
              value={organizationName}
              onChange={(value) => setOrganizationName(value ?? "")}
              placeholder="Select Organization"
              style={{ width: 400, marginBottom: 10 }}
            />
          </div>
          <div>
            <label>First Name: </label>
            <Input
              type={"text"}
              placeholder={"First Name"}
              style={{ marginBottom: 10 }}
              onChange={(value) => {
                setFirstName(value);
              }}
              required
            />
          </div>
          <div>
            <label>Last Name: </label>
            <Input
              type={"text"}
              placeholder={"Last Name"}
              style={{ marginBottom: 10 }}
              onChange={(value) => {
                setLastName(value);
              }}
              required
            />
          </div>
          <div>
            <label>Email: </label>
            <Input
              type="email"
              placeholder={"E-mail"}
              style={{ marginBottom: 10 }}
              onChange={(value) => {
                setEmail(value);
              }}
              required
            />
            {emailError && (
              <div style={{ color: "red", marginBottom: 10 }}>{emailError}</div>
            )}
          </div>
          <div>
            <label>Date of Birth:</label>
            <Input
              type={"date"}
              style={{ marginBottom: 10 }}
              onChange={(value) => {
                setDOB(value);
              }}
              max={todayDate}
              required
            />
          </div>
          <div>
            <label>Date of Joining: </label>
            <Input
              type={"date"}
              style={{ marginBottom: 15 }}
              onChange={(value) => {
                setDOJ(value);
              }}
              min={dob}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              // closeOrgCreateModal();
              handleSubmit();
            }}
            appearance="primary"
          >
            Create
          </Button>
          <Button
            onClick={() => {
              closeOrgCreateModal();
            }}
            appearance="ghost"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create organization Modal */}
      <Modal open={openCreate} onClose={closeCreateModal} size={"xs"}>
        <Modal.Title
          style={{ textAlign: "center", fontSize: "25px", fontWeight: "bold" }}
        >
          <div style={{ margin: 10 }}>Create Organization</div>
        </Modal.Title>
        <Modal.Body>
          <>
            <Input
              placeholder="Enter Organization Name"
              onChange={(value) => {
                setNewOrgName(value);
              }}
              style={{ marginBottom: 10 }}
              required
            />
            <InputNumber
              min={0}
              placeholder="Maximum Work from home"
              onChange={(value) => {
                setWfhDays(Number(value));
              }}
              required
            />
            {maxwfhError && (
              <div style={{ color: "red", marginTop: 10 }}>{maxwfhError}</div>
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              // closeCreateModal();
              RegisterOrganization();
              setIsLoading(true);
            }}
            appearance="primary"
          >
            Create
          </Button>
          <Button
            onClick={() => {
              closeCreateModal();
            }}
            appearance="ghost"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Organization Modal */}
      <Modal open={openEdit} onClose={closeEditModal} size={"xs"}>
        <h4>Edit Organization</h4>

        <Modal.Body>
          <label>Organization Name</label>
          <Input
            placeholder="Organization Name"
            value={editOrgName}
            onChange={(value) => {
              setEditOrgName(value);
            }}
            style={{ marginBottom: 10 }}
          />
          <label>Maximum WFH</label>
          <InputNumber
            min={0}
            max={31}
            value={newWfhDays}
            onChange={(value) => {
              setNewWfhDays(Number(value));
            }}
            style={{ marginBottom: 10 }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setIsLoading(true);
              editOrganization();
            }}
            appearance="primary"
          >
            Apply
          </Button>
          <Button
            onClick={() => {
              closeEditModal();
            }}
            appearance="ghost"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
}
