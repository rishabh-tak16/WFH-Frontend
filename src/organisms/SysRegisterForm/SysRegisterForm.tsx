import { useState } from "react";
import React from "react";
import { Button, Input, InputGroup } from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import axios from "axios";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import styles from "./SysRegisterForm.module.scss";


export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [visible, setVisible] = useState(false);

  const cx = classNames.bind(styles);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { firstName, lastName, email, password, dob };
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/sysuser-register",
        { firstName, lastName, email, password, dob }
      );
      console.log(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = () => {
    setVisible(!visible);
  };

  return (
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
            <label>Password</label>
            <InputGroup style={{marginBottom:10}}>
              <Input
                type={visible === false ? "password" : "text"}
                placeholder={"password"}
                style={{width: 260}}
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
  );
}
