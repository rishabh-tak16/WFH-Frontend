import axios from "axios";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Table,
  SelectPicker,
  Button,
  Modal,
  Whisper,
  Tooltip,
  Input,
} from "rsuite";
import { useState, useEffect } from "react";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import { ToastContainer, toast } from "react-toastify";
const { Column, HeaderCell, Cell } = Table;

export default function SysDashboard() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [organizationValue, setOrganizationValue] = useState("");
  const [useremail, setuseremail] = useState("");
  const [username, setUsername] = useState("");
  const [modalId, setModalId] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");
  const [wfhDays, setWfhDays] = useState("");
  const [updated, setUpdated] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const openDeleteModal = () => setDeleteOpen(true);
  const closeDeleteModal = () => setDeleteOpen(false);

  const [openCreate, setOpenCreate] = useState(false);
  const openCreateModal = () => setOpenCreate(true);
  const closeCreateModal = () => setOpenCreate(false);

  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token: string | undefined = cookies.get("accessToken");
    if (!token) navigate('/');
    if (typeof token === "string") {
      SystemUserDashBoardRequest(token);
      AllOrganization();
    }
  }, []);

  const AllOrganization = async () => {
    const URL = "http://localhost:5000/organization";
    try {
      const response = await axios.get(URL);
      setOrganizations(response.data.organizations);
    } catch (err) {
      console.log(err);
    }
  };

  const RegisterOrganization = async () => {
    console.log("Function Called");
    const URL = "http://localhost:5000/org-register";
    try {
      const api = await axios.post(URL, { name: newOrgName, max_wfh: wfhDays });
      console.log(api.data);
    } catch (err) {
      console.log(err);
    }
  };

  const SystemUserDashBoardRequest = async (token: string) => {
    const URL = "http://localhost:5000/sysuser-dashboard";

    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: `BEARER ${token}`,
      };
      const post_dashboard_api = await axios.post(URL, JSON.stringify({}), {
        headers,
      });

      const response = post_dashboard_api.data;
      setUser(response.user);
      setUsers(response.user_data);

      return response;
    } catch (err) {
      return "DashBoard Error";
    }
  };

  const makeadmin = async (email: string) => {
    const token: string | undefined = cookies.get("accessToken");
    const URL = "http://localhost:5000/org-admin";
    const payload = {
      email: email,
      orgName: organizationValue,
    };
    setOrganizationValue("");
    setUsername("");
    console.log(payload);
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: `BEARER ${token}`,
      };
      const post_admin_api = await axios.post(URL, payload, {
        headers,
      });
      const response = post_admin_api.data;
      console.log("Response", response);
      toast.success(response.msg);
    } catch (err) {
      console.log(err);
      return "DashBoard Error";
    }
  };

  const deleteUser = async (email: string) => {
    const token: string = cookies.get("accessToken");
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
      console.log("Response", response);
      toast.success("User deleted Successfully....");
      SystemUserDashBoardRequest(token);
    } catch (err) {
      console.log(err);
      return "DashBoard Error";
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          cookies.remove("accessToken");
          navigate("/sys-login");
        }}
      >
        Logout
      </Button>
      <div>
        <h3
          style={{
            fontFamily: "sans-serif",
            width: "100",
            textAlign: "center",
            paddingTop: "10px",
          }}
        >
          Welcome System User : {user.firstName}
        </h3>
        <div
          style={{
            border: "2px solid black",
            width: 1200,
            marginLeft: 130,
            marginTop: 90,
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          <Table height={420} style={{ marginTop: 15 }} data={users}>
            <Column width={100} resizable>
              <HeaderCell>
                <b>First Name</b>
              </HeaderCell>
              <Cell dataKey="firstName" />
            </Column>

            <Column width={100} resizable>
              <HeaderCell>
                <b>Last Name</b>
              </HeaderCell>
              <Cell dataKey="lastName" />
            </Column>

            <Column width={200} resizable>
              <HeaderCell>
                <b>Email</b>
              </HeaderCell>
              <Cell dataKey="email" />
            </Column>
            <Column width={200} resizable>
              <HeaderCell>
                <b>Date of Joining</b>
              </HeaderCell>
              <Cell dataKey="doj">
                {(rowData) =>
                  new Date(rowData.doj).toLocaleString().split(",")[0]
                }
              </Cell>
            </Column>

            <Column width={200} resizable>
              <HeaderCell>
                <b>Date of Birth </b>
              </HeaderCell>
              <Cell dataKey="dob">
                {(rowData) =>
                  new Date(rowData.dob).toLocaleString().split(",")[0]
                }
              </Cell>
            </Column>

            <Column width={200} resizable>
              <HeaderCell>
                <b>Organization</b>
              </HeaderCell>
              <Cell dataKey="organization_list">
                {(rowData) => {
                  const orgs = rowData.organization_list;
                  if (orgs.length <= 2) {
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

            <Column align="center">
              <HeaderCell>
                <b>Action</b>{" "}
              </HeaderCell>
              <Cell style={{ padding: "6px" }}>
                {(rowData) => (
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
                )}
              </Cell>
            </Column>

            <Column minWidth={400}>
              <HeaderCell> </HeaderCell>
              <Cell style={{ padding: "6px" }}>
                {(rowData) => (
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
                )}
              </Cell>
            </Column>
          </Table>
        </div>
        <div>
          <h3
            style={{
              fontFamily: "sans-serif",
              width: "100",
              textAlign: "center",
              paddingTop: "10px",
              marginTop: "100",
            }}
          >
            Organization
          </h3>
          <Button onClick={openCreateModal}>Create Organization</Button>
        </div>

        <div
          style={{
            border: "2px solid black",
            width: 800,
            marginLeft: 350,
            marginTop: 40,
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          <Table height={420} style={{ marginTop: 10 }} data={organizations}>
            <Column width={200} resizable>
              <HeaderCell>
                <b>Orgnaization Name</b>
              </HeaderCell>
              <Cell dataKey="name" />
            </Column>
            <Column width={200} resizable>
              <HeaderCell>
                <b>Maximum WFH</b>
              </HeaderCell>
              <Cell dataKey="max_wfh" />
            </Column>
            <Column width={250} resizable>
              <HeaderCell>
                <b>Admin</b>
              </HeaderCell>
              <Cell dataKey="admin" />
            </Column>
            <Column minWidth={400}>
              <HeaderCell>
                <b>Edit</b>
              </HeaderCell>
              <Cell style={{ padding: "6px" }}>
                <EditIcon></EditIcon>
              </Cell>
            </Column>
          </Table>
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ textAlign: "center" }}>
            {" "}
            <h4>Admin Panel</h4> <br /> User : {username}
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
              handleClose();
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

      <Modal open={deleteOpen} onClose={closeDeleteModal}>
        <Modal.Header>
          <Modal.Title style={{ textAlign: "center" }}>
            <h4>Delete Panel</h4> <br /> User : {username}
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
              closeDeleteModal();
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

      {/* Create organization Model */}
      <Modal open={openCreate} onClose={closeCreateModal}>
        <Modal.Title style={{ textAlign: "center" }}>
          {" "}
          <h4>Create Organization</h4>
        </Modal.Title>
        <Modal.Body>
          <Input
            placeholder="Enter Organization Name"
            onChange={(value) => {
              setNewOrgName(value);
            }}
          />
          <Input
            placeholder="Maximum Work from home"
            onChange={(value) => {
              setWfhDays(value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              closeCreateModal();
              RegisterOrganization();
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

      <Modal open={openCreate} onClose={closeCreateModal}>
        <Modal.Title style={{ textAlign: "center" }}>
          <h4>Edit Organization User</h4>
        </Modal.Title>
        <Modal.Body>
          <Input
            placeholder="Enter Organization Name"
            onChange={(value) => {
              setNewOrgName(value);
            }}
          />
          <Input
            placeholder="Maximum Work from home"
            onChange={(value) => {
              setWfhDays(value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              closeCreateModal();
              RegisterOrganization();
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

      <ToastContainer />
    </>
  );
}
