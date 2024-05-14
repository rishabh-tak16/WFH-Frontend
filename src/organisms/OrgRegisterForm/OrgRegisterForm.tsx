import { Input, Button, InputGroup } from "rsuite";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import styles from "./OrgRegisterForm.module.scss";
import "./OrgRegisterForm.module.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrgRegisterForm() {
  const [organizationName,setOrganizationName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [doj, setDOJ] = useState("");
  const [visible, setVisible] = useState(false);

  const handleChange = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { organizationName, firstName, lastName, email, password, dob, doj };
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/orguser-register",
        { organizationName, firstName, lastName, email, password, dob, doj }
      );
      toast.success("User registered Sucessfully")
      console.log(response);
    } catch (error: any) {
      toast.error("Something Problematic");
      console.error("Error submitting form:", error.response.data.msg);
    }
  };

  return (
    <>
      <div className={styles.orgregcontainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.wrapper}>
            <h2>Registration</h2>
            <div className={styles.formbox}>
              <div>
                <label>Organisation Name: </label>
                <Input
                  type={"text"}
                  placeholder={"Organization Name"}
                  style={{ marginBottom: 10, width: 300 }}
                  onChange={(value) => {
                    setOrganizationName(value);
                  }}
                  required
                />
              </div>
              <div>
                <label>First Name: </label>
                <Input
                  type={"text"}
                  placeholder={"First Name"}
                  style={{ marginBottom: 10, width: 300 }}
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
                  style={{ marginBottom: 10, width: 300 }}
                  onChange={(value) => {
                    setLastName(value);
                  }}
                  required
                />
              </div>
              <div>
                <label>Email: </label>
                <Input
                  type={"email"}
                  placeholder={"E-mail"}
                  style={{ marginBottom: 10, width: 300 }}
                  onChange={(value) => {
                    setEmail(value);
                  }}
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <InputGroup style={{ marginBottom: 10 }}>
                  <Input
                    type={visible === false ? "password" : "text"}
                    placeholder={"password"}
                    style={{ width: 260 }}
                    onChange={(value) => {
                      setPassword(value);
                    }}
                    required={true}
                  />
                  <InputGroup.Addon onClick={handleChange}>
                    {visible ? <EyeIcon /> : <EyeSlashIcon />}
                  </InputGroup.Addon>
                </InputGroup>
              </div>
              <div>
                <label>Date of Birth:</label>
                <Input
                  type={"date"}
                  style={{ marginBottom: 10, width: 300 }}
                  onChange={(value) => {
                    setDOB(value);
                  }}
                  required
                />
              </div>
              <div>
                <label>Date of Joining: </label>
                <Input
                  type={"date"}
                  style={{ marginBottom: 15, width: 300 }}
                  onChange={(value) => {
                    setDOJ(value);
                  }}
                  required
                />
              </div>
              <Button type="submit" appearance="primary" size="lg">
                Register
              </Button>
              <label style={{ marginTop: 20 }}>
                Already a User?
                <Link to={"/org-login"} style={{ marginLeft: 3 }}>
                  Login
                </Link>
              </label>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
