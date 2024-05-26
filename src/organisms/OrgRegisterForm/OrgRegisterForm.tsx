import { Input, Button } from "rsuite";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./OrgRegisterForm.module.scss";
import "./OrgRegisterForm.module.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OrgRegisterForm() {

  const [organizationName,setOrganizationName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
  const [doj, setDOJ] = useState("");

  const todayDate = new Date().toISOString().split('T')[0];

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { organizationName, firstName, lastName, email,dob, doj };
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/orguser-register",
        { organizationName, firstName, lastName, email, dob, doj }
      );
      toast.success("User registered Sucessfully");
      console.log(response);
      navigate("/sys/dashboard");
    } catch (error: any) {
      toast.error("Organization does not exists");
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
                <label>Date of Birth:</label>
                <Input
                  type={"date"}
                  style={{ marginBottom: 10, width: 300 }}
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
                  style={{ marginBottom: 15, width: 300 }}
                  onChange={(value) => {
                    setDOJ(value);
                  }}
                  min={dob}
                  required
                />
              </div>
              <div style={{marginTop:20}}>
              <Button type="submit" appearance="primary" size="lg">
                Register
              </Button>
              <Button appearance="ghost" size="lg" style={{marginLeft:10}}>
                Cancel
              </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
