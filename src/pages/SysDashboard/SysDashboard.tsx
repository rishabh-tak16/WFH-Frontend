import axios from "axios";
import Cookies from "js-cookie";
import { Table, SelectPicker } from "rsuite";
import { useState, useEffect } from "react";
const { Column, HeaderCell, Cell } = Table;


export default function SysDashboard() {
  const [organizationValue, setOrganizationValue] = useState("");
  const [user, setUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
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
        console.log(response);
        setUser(response.user);
        setUsers(response.user_data)

        return response;
      } catch (err) {
        console.log(err);
        return "DashBoard Error";
      }
    };

    const token: string | undefined = Cookies.get("accessToken");
    if (typeof token === "string") {
      SystemUserDashBoardRequest(token);
    }
  }, []);

  return (
    <div>
      <h3> Welcome System User : {user.firstName}</h3>
      <div style={{border: "2px solid black", width: 1000,marginLeft:220,marginTop: 90, padding:20 }}>
      <Table height={420} style={{marginTop:50}} data={users}>

        <Column width={100} resizable>
          <HeaderCell><b>First Name</b></HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={100} resizable>
          <HeaderCell><b>Last Name</b></HeaderCell>
          <Cell dataKey="lastName" />
        </Column>

        <Column width={200} resizable>
          <HeaderCell><b>Email</b></HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={200} resizable>
          <HeaderCell><b>Date of Joining</b></HeaderCell>
          <Cell dataKey="doj">{rowData => new Date(rowData.doj).toLocaleString().split(",")[0]}</Cell>
        </Column>

        <Column width={200} resizable>
          <HeaderCell><b>Date of Birth </b></HeaderCell>
          <Cell dataKey="dob">{rowData => new Date(rowData.dob).toLocaleString().split(",")[0]}</Cell>
        </Column>

        <Column width={200} resizable>
          <HeaderCell><b>Organization</b></HeaderCell>
          <Cell style={{ padding: "6px" }}>
              {(rowData) => (
                <SelectPicker
                  onChange={(value: string | undefined | void | null) => {
                    if (typeof value === "string") {
                      setOrganizationValue(value);
                    }
                    console.log(value);
                  }}
                  data={rowData.organization_list.map((org: string) => ({
                    label: org,
                    value: org,
                  }))}
                ></SelectPicker>
              )}
            </Cell>
        </Column>
      </Table>
    </div>
    </div>
  );
}
