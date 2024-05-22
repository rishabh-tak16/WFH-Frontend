import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "rsuite";
import axios from "axios";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import styles from "./SysRegisterForm.module.scss";


export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");

  const cx = classNames.bind(styles);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { firstName, lastName, email, dob };
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/sysuser-register",
        formData
      );
      toast.success("User registered Sucessfully")
      navigate("/sys-login")
      console.log(response);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error Submitting");
    }
  };

  return (
    <>
    <div className={cx("regcontainer")}>
      <form onSubmit={handleSubmit}>
        <div className={cx("wrapper")}>
          <h2>Registration</h2>
          <div className={cx("formbox")}>
            <div>
              <label>First Name :</label>
              <Input
                type={"text"}
                placeholder={"First Name"}
                style={{ marginBottom: 10, width: 300 }}
                onChange={(value) => {
                  setFirstName(value);
                }}
                required={true}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <Input
                type={"text"}
                placeholder={"Last Name"}
                style={{ marginBottom: 10, width: 300 }}
                onChange={(value) => {
                  setLastName(value);
                }}
                required={true}
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
                required={true}
              />
            </div>
            <div>
              <label>Date of Birth: </label>
            <Input
              type={"date"}
              style={{ marginBottom: 20, width: 300 }}
              onChange={(value) => {
                setDOB(value);
              }}
              required={true}
            />
            </div>
            <Button type="submit" appearance="primary" size="lg">
              Register
            </Button>
            <label style={{ marginTop: 20 }}>
              Already a User?
              <Link to={"/sys-login"} style={{ marginLeft: 3 }}>
                Login
              </Link>
            </label>
          </div>
        </div>
      </form>
    </div>
    <ToastContainer/>
    </>
  );
}
