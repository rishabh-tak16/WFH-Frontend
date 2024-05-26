import axios from "axios";
import Cookies from 'js-cookie';
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
} from "rsuite";
import { useState, useEffect } from "react";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import PlusIcon from '@rsuite/icons/Plus';
import { ToastContainer, toast } from "react-toastify";

const { Column, HeaderCell, Cell } = Table;

export default function SysDashboard() {
  const navigate = useNavigate();
  const [organizationValue, setOrganizationValue] = useState("");
  const [useremail, setuseremail] = useState("");
  const [username, setUsername] = useState("");
  const [modalId, setModalId] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [wfhDays, setWfhDays] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [showOrganizations, setShowOrganizations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //states For Editing Organization
  const [orgId, setOrgId] = useState();
  const [editOrgName, setEditOrgName] = useState("");
  const [newWfhDays, setNewWfhDays] = useState(0);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const openDeleteModal = () => setDeleteOpen(true);
  const closeDeleteModal = () => setDeleteOpen(false);

  const [openCreate, setOpenCreate] = useState(false);
  const openCreateModal = () => setOpenCreate(true);
  const closeCreateModal = () => setOpenCreate(false);

  const [openEdit, setOpenEdit] = useState(false);
  const openEditModal = () => setOpenEdit(true);
  const closeEditModal = () => setOpenEdit(false);

  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
  }, [])

  useEffect(() => {
    const token: string | undefined = Cookies.get("accessToken");
    if (!token) navigate("/");
    if (typeof token === "string") {
      SystemUserDashBoardRequest(token);
      AllOrganization();
      setIsLoading(false);
    }
  }, [isLoading]);

  const AllOrganization = async () => {
    const URL = "http://localhost:5000/organization";
    try {
      const response = await axios.get(URL);

      setOrganizations(response.data.organizations);
      //setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const RegisterOrganization = async () => {
    const URL = "http://localhost:5000/org-register";
    try {
      const api = await axios.post(URL, { name: newOrgName, max_wfh: wfhDays });
      console.log(api.data);
    } catch (err) {
      console.log(err);
    }
  };

  const SystemUserDashBoardRequest = async (token: string | undefined) => {
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

  const deliveOrganization = async (_id: any) => {
    if (!_id) {
      return;
    }
    const URL = "http://localhost:5000/delete-org";

    try {
      const api = await axios.put(URL, { _id });
    } catch (err) {
      console.log(err);
    }
  };

  const editOrganization = async () => {
    console.log("Edit Organization function called");

    if (!orgId) {
      return;
    }
    const URL = "http://localhost:5000/update-org";
    try {
      const api = await axios.put(URL, { _id: orgId, orgName: editOrgName, max_wfh: newWfhDays });
      //setUpdated(!updated);
    } catch (err) {
      console.log(err);
    }
  };

  const makeadmin = async (email: string) => {
    const token: string | undefined = Cookies.get("accessToken");
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
      console.log("Response", response);
      toast.success("User deleted Successfully....");
      //SystemUserDashBoardRequest(token);
    } catch (err) {
      console.log(err);
      return "DashBoard Error";
    }
  };

  const handleShowOrganizations = async () => {
    if (!showOrganizations) {
      await AllOrganization();
    }
    setShowOrganizations(!showOrganizations);
  };

  return (
    <>
      <div>
        <h3
          style={{
            fontFamily: "sans-serif",
            width: "100",
            textAlign: "center",
            paddingTop: "10px",
            marginBottom: 10
          }}
        >
          Welcome System User : {user.firstName}
        </h3>
        <Button
          startIcon={<PlusIcon />}
          style={{ marginLeft: 8 }}
          appearance="primary"
          onClick={() => {
            navigate("/org/register");
          }}
        >Create Organization User</Button>
        <Button startIcon={<PlusIcon />} appearance="primary" onClick={openCreateModal} style={{ marginLeft: 10 }}>Create Organization</Button>
        <Button
          appearance="primary"
          style={{ marginLeft: 10 }}
          onClick={handleShowOrganizations}
        >
          {showOrganizations ? "Hide Organizations" : "Show Organizations"}
        </Button>
        <Button
          appearance="ghost"
          color="red"
          style={{ marginLeft: 900 }}
          onClick={() => {
            Cookies.remove('accessToken');
            navigate("/");
          }}
        >
          Logout
        </Button>
        <div
          style={{
            border: "2px solid black",
            width: 1200,
            marginLeft: 130,
            marginTop: 60,
            padding: 20,
            borderRadius: 20,
            marginBottom: 30,
          }}
        >
          {/* All Organizations User Table*/}
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

        {showOrganizations && (
          <div
            style={{
              border: "2px solid black",
              width: 900,
              marginLeft: 300,
              marginTop: 40,
              padding: 10,
              borderRadius: 20,
              marginBottom: 30,
            }}
          >
            <Table
            height={420}
            style={{ marginTop: 10, marginLeft: 65 }}
            data={organizations}>
            <Column width={210} resizable>
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
            <Column minWidth={300}>
              <HeaderCell align="center">
                <b>Action</b>
              </HeaderCell>
              <Cell style={{ padding: "6px" }}>
                {(rowData) => (
                  <>
                    <span>
                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip> Edit </Tooltip>}
                      >
                        <EditIcon
                          style={{ cursor: "pointer", fontSize:"24"}}
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
                    <TrashIcon
                      style={{
                        fontSize: "2em",
                        color: "red",
                        marginLeft: "30px",
                      }}
                      onClick={() => {
                        deliveOrganization(rowData._id);
                        setIsLoading(true);
                      }}
                    /></>)}
              </Cell>
            </Column>
          </Table>
          </div>
        )}
      </div>
      

      {/* Maek Admin Modal*/}
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ textAlign: "center" }}>
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

      {/* Delete Modal */}
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

      {/* Create organization Modal */}
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
            style={{ marginBottom: 10 }}
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

      {/* Edit Orgnaization Modal */}
      <Modal open={openEdit} onClose={closeEditModal}>
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
          <Input
            value={newWfhDays}
            onChange={(value) => {
              setNewWfhDays(parseInt(value));
            }}
            style={{ marginBottom: 10 }}
          />

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            closeEditModal();
            setIsLoading(true);
            editOrganization();
          }} appearance="primary">
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

// //------------------------------------------------------------------------------------------
// import axios from "axios";
// import Cookies from 'js-cookie';
// import { useNavigate } from "react-router-dom";
// import {
//   Table,
//   SelectPicker,
//   Button,
//   Modal,
//   Whisper,
//   Tooltip,
//   Input,
// } from "rsuite";
// import { useState, useEffect } from "react";
// import TrashIcon from "@rsuite/icons/Trash";
// import EditIcon from "@rsuite/icons/Edit";
// import PlusIcon from '@rsuite/icons/Plus';
// import { ToastContainer, toast } from "react-toastify";

// const { Column, HeaderCell, Cell } = Table;

// export default function SysDashboard() {
//   const navigate = useNavigate();
//   const [organizationValue, setOrganizationValue] = useState("");
//   const [useremail, setuseremail] = useState("");
//   const [username, setUsername] = useState("");
//   const [modalId, setModalId] = useState([]);
//   const [organizations, setOrganizations] = useState([]);
//   const [wfhDays, setWfhDays] = useState("");
//   const [newOrgName, setNewOrgName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showOrganizations, setShowOrganizations] = useState(false); // New state

//   //states For Editing Organization
//   const [orgId, setOrgId] = useState();
//   const [editOrgName, setEditOrgName] = useState("");
//   const [newWfhDays, setNewWfhDays] = useState(0);

//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const openDeleteModal = () => setDeleteOpen(true);
//   const closeDeleteModal = () => setDeleteOpen(false);

//   const [openCreate, setOpenCreate] = useState(false);
//   const openCreateModal = () => setOpenCreate(true);
//   const closeCreateModal = () => setOpenCreate(false);

//   const [openEdit, setOpenEdit] = useState(false);
//   const openEditModal = () => setOpenEdit(true);
//   const closeEditModal = () => setOpenEdit(false);

//   const [user, setUser] = useState({
//     _id: "",
//     firstName: "",
//     lastName: "",
//   });

//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//   }, [])

//   useEffect(() => {
//     const token: string | undefined = Cookies.get("accessToken");
//     if (!token) navigate("/");
//     if (typeof token === "string") {
//       SystemUserDashBoardRequest(token);
//       setIsLoading(false);
//     }
//   }, [isLoading]);

//   const AllOrganization = async () => {
//     const URL = "http://localhost:5000/organization";
//     try {
//       const response = await axios.get(URL);

//       setOrganizations(response.data.organizations);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const RegisterOrganization = async () => {
//     const URL = "http://localhost:5000/org-register";
//     try {
//       const api = await axios.post(URL, { name: newOrgName, max_wfh: wfhDays });
//       console.log(api.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const SystemUserDashBoardRequest = async (token: string | undefined) => {
//     const URL = "http://localhost:5000/sysuser-dashboard";

//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         authorization: `BEARER ${token}`,
//       };
//       const post_dashboard_api = await axios.post(URL, JSON.stringify({}), {
//         headers,
//       });

//       const response = post_dashboard_api.data;
//       setUser(response.user);
//       setUsers(response.user_data);

//       return response;
//     } catch (err) {
//       return "DashBoard Error";
//     }
//   };

//   const deliveOrganization = async (_id: any) => {
//     if (!_id) {
//       return;
//     }
//     const URL = "http://localhost:5000/delete-org";

//     try {
//       const api = await axios.put(URL, { _id });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const editOrganization = async () => {
//     console.log("Edit Organization function called");

//     if (!orgId) {
//       return;
//     }
//     const URL = "http://localhost:5000/update-org";
//     try {
//       const api = await axios.put(URL, { _id: orgId, orgName: editOrgName, max_wfh: newWfhDays });
//       //setUpdated(!updated);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const makeadmin = async (email: string) => {
//     const token: string | undefined = Cookies.get("accessToken");
//     const URL = "http://localhost:5000/org-admin";
//     const payload = {
//       email: email,
//       orgName: organizationValue,
//     };
//     setOrganizationValue("");
//     setUsername("");
//     console.log(payload);
//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         authorization: `BEARER ${token}`,
//       };
//       const post_admin_api = await axios.post(URL, payload, {
//         headers,
//       });
//       const response = post_admin_api.data;
//       console.log("Response", response);
//       toast.success(response.msg);
//     } catch (err) {
//       console.log(err);
//       return "DashBoard Error";
//     }
//   };

//   const deleteUser = async (email: string) => {
//     const token: string | undefined = Cookies.get("accessToken");
//     const URL = "http://localhost:5000/orguser-delete";
//     const payload = {
//       email: email,
//       organizationValue: organizationValue,
//     };
//     setOrganizationValue("");
//     setUsername("");
//     try {
//       const headers = {
//         "Content-Type": "application/json",
//         authorization: `BEARER ${token}`,
//       };
//       const post_deleteuser_api = await axios.post(URL, payload, {
//         headers,
//       });
//       const response = post_deleteuser_api.data;
//       console.log("Response", response);
//       toast.success("User deleted Successfully....");
//       SystemUserDashBoardRequest(token);
//     } catch (err) {
//       console.log(err);
//       return "DashBoard Error";
//     }
//   };

//   const handleShowOrganizations = async () => {
//     if (!showOrganizations) {
//       await AllOrganization();
//     }
//     setShowOrganizations(!showOrganizations);
//   };

//   return (
//     <>
//       <div>
//         <h3
//           style={{
//             fontFamily: "sans-serif",
//             width: "100",
//             textAlign: "center",
//             paddingTop: "10px",
//             marginBottom: 10
//           }}
//         >
//           Welcome System User : {user.firstName}
//         </h3>
//         <Button
//           startIcon={<PlusIcon />}
//           style={{ marginLeft: 8 }}
//           appearance="primary"
//           onClick={() => {
//             navigate("/org/register");
//           }}
//         >Create Organization User</Button>
//         <Button startIcon={<PlusIcon />} appearance="primary" onClick={openCreateModal} style={{ marginLeft: 10 }}>Create Organization</Button>
//         <Button
//           appearance="primary"
//           style={{ marginLeft: 10 }}
//           onClick={handleShowOrganizations}
//         >
//           {showOrganizations ? "Hide Organizations" : "Show Organizations"}
//         </Button>
//         <Button
//           appearance="ghost"
//           color="red"
//           style={{ marginLeft: 950 }}
//           onClick={() => {
//             Cookies.remove('accessToken');
//             navigate("/");
//           }}
//         >
//           Logout
//         </Button>
//         <div
//           style={{
//             border: "2px solid black",
//             width: 1200,
//             marginLeft: 130,
//             marginTop: 60,
//             padding: 20,
//             borderRadius: 20,
//             marginBottom: 30,
//           }}
//         >
//           {/* All Organizations User Table*/}
//           <Table height={420} style={{ marginTop: 15 }} data={users}>
//             <Column width={100} resizable>
//               <HeaderCell>
//                 <b>First Name</b>
//               </HeaderCell>
//               <Cell dataKey="firstName" />
//             </Column>

//             <Column width={100} resizable>
//               <HeaderCell>
//                 <b>Last Name</b>
//               </HeaderCell>
//               <Cell dataKey="lastName" />
//             </Column>

//             <Column width={200} resizable>
//               <HeaderCell>
//                 <b>Email</b>
//               </HeaderCell>
//               <Cell dataKey="email" />
//             </Column>
//             <Column width={200} resizable>
//               <HeaderCell>
//                 <b>Date of Joining</b>
//               </HeaderCell>
//               <Cell dataKey="doj">
//                 {(rowData) =>
//                   new Date(rowData.doj).toLocaleString().split(",")[0]
//                 }
//               </Cell>
//             </Column>

//             <Column width={200} resizable>
//               <HeaderCell>
//                 <b>Date of Birth </b>
//               </HeaderCell>
//               <Cell dataKey="dob">
//                 {(rowData) =>
//                   new Date(rowData.dob).toLocaleString().split(",")[0]
//                 }
//               </Cell>
//             </Column>

//             <Column width={100} resizable>
//               <HeaderCell>
//                 <b>Role</b>
//               </HeaderCell>
//               <Cell dataKey="role" />
//             </Column>
//             <Column width={120} fixed="right">
//               <HeaderCell>
//                 <b>Make Organization Admin</b>
//               </HeaderCell>
//               <Cell style={{ padding: "6px" }}>
//                 {(rowData) => (
//                   <div style={{ display: "flex" }}>
//                     <Input
//                       style={{ marginRight: "5px" }}
//                       placeholder="organization"
//                       value={organizationValue}
//                       onChange={(value, event) => {
//                         setOrganizationValue(value);
//                         setuseremail(rowData.email);
//                         setUsername(rowData.firstName);
//                       }}
//                     />
//                     <Button
//                       appearance="primary"
//                       onClick={() => {
//                         makeadmin(rowData.email);
//                       }}
//                     >
//                       Make Admin
//                     </Button>
//                   </div>
//                 )}
//               </Cell>
//             </Column>

//             <Column width={80} fixed="right">
//               <HeaderCell>
//                 <b>Action</b>
//               </HeaderCell>

//               <Cell style={{ padding: "6px" }}>
//                 {(rowData) => (
//                   <span>
//                     <Whisper
//                       placement="top"
//                       trigger="hover"
//                       speaker={<Tooltip> Delete </Tooltip>}
//                     >
//                       <TrashIcon
//                         style={{ cursor: "pointer" }}
//                         color="red"
//                         onClick={() => {
//                           setuseremail(rowData.email);
//                           openDeleteModal();
//                         }}
//                       />
//                     </Whisper>
//                   </span>
//                 )}
//               </Cell>
//             </Column>
//           </Table>
//         </div>
//         {showOrganizations && ( // Conditionally render the organization table
//           <div style={{ marginLeft: 130, marginTop: 50 }}>
//             <h4>Organization Table</h4>
//             <Table height={420} data={organizations}>
//               <Column width={100} align="center" fixed>
//                 <HeaderCell>Organization Name</HeaderCell>
//                 <Cell dataKey="orgName" />
//               </Column>

//               <Column width={100} align="center" fixed>
//                 <HeaderCell>Max Work From Home Days</HeaderCell>
//                 <Cell dataKey="max_wfh" />
//               </Column>
//               <Column width={100} align="center" fixed>
//                 <HeaderCell>Edit Organization</HeaderCell>
//                 <Cell style={{ padding: "6px" }}>
//                   {(rowData) => (
//                     <span>
//                       <Whisper
//                         placement="top"
//                         trigger="hover"
//                         speaker={<Tooltip> Edit </Tooltip>}
//                       >
//                         <EditIcon
//                           style={{ cursor: "pointer" }}
//                           color="blue"
//                           onClick={() => {
//                             setOrgId(rowData._id);
//                             openEditModal();
//                           }}
//                         />
//                       </Whisper>
//                     </span>
//                   )}
//                 </Cell>
//               </Column>
//               <Column width={100} align="center" fixed>
//                 <HeaderCell>Delete Organization</HeaderCell>
//                 <Cell style={{ padding: "6px" }}>
//                   {(rowData) => (
//                     <span>
//                       <Whisper
//                         placement="top"
//                         trigger="hover"
//                         speaker={<Tooltip> Delete </Tooltip>}
//                       >
//                         <TrashIcon
//                           style={{ cursor: "pointer" }}
//                           color="red"
//                           onClick={() => {
//                             setOrgId(rowData._id);
//                             openDeleteModal();
//                           }}
//                         />
//                       </Whisper>
//                     </span>
//                   )}
//                 </Cell>
//               </Column>
//             </Table>
//           </div>
//         )}
//       </div>

//       {/* Modal For Organization  */}
//       <Modal backdrop="static" open={openCreate} onClose={closeCreateModal} size="xs">
//         <Modal.Header>
//           <Modal.Title>Organization Register</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Input
//             placeholder="Enter Organization Name"
//             onChange={(value, event) => {
//               setNewOrgName(value);
//             }}
//           />
//           <br />
//           <br />
//           <Input
//             placeholder="Enter Max WFH Days"
//             onChange={(value, event) => {
//               setWfhDays(value);
//             }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={RegisterOrganization} appearance="primary">
//             Submit
//           </Button>
//           <Button onClick={closeCreateModal} appearance="subtle">
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal For Edit Organization */}
//       <Modal backdrop="static" open={openEdit} onClose={closeEditModal} size="xs">
//         <Modal.Header>
//           <Modal.Title>Edit Organization</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         <label>Organization Name</label>
//           <Input
//             placeholder="Enter New Organization Name"
//             onChange={(value) => {
//               setEditOrgName(value);
//             }}
//           />
//           <br />
//           <br />
//           <label>Maximum WFH</label>
//           <Input
//             placeholder="Maximum WFH"
//             value={newWfhDays}
//             onChange={(value) => {
//               setNewWfhDays(parseInt(value));
//             }}
//             style={{ marginBottom: 10 }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={editOrganization} appearance="primary">
//             Submit
//           </Button>
//           <Button onClick={closeEditModal} appearance="subtle">
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal For Delete Organization  */}
//       <Modal backdrop="static" open={deleteOpen} onClose={closeDeleteModal} size="xs">
//         <Modal.Header>
//           <Modal.Title>Delete Organization</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h4 style={{ textAlign: 'center' }}>Are You Sure?</h4>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => {
//             deliveOrganization(orgId);
//             closeDeleteModal();
//           }} appearance="primary">
//             Yes
//           </Button>
//           <Button onClick={closeDeleteModal} appearance="subtle">
//             No
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal For Delete User  */}
//       <Modal backdrop="static" open={deleteOpen} onClose={closeDeleteModal} size="xs">
//         <Modal.Header>
//           <Modal.Title>Delete User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h4 style={{ textAlign: 'center' }}>Are You Sure?</h4>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => {
//             deleteUser(useremail);
//             closeDeleteModal();
//           }} appearance="primary">
//             Yes
//           </Button>
//           <Button onClick={closeDeleteModal} appearance="subtle">
//             No
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

