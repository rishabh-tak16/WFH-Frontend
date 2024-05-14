import { Input, Button, InputGroup } from "rsuite";
import { useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { useNavigate } from "react-router-dom";

import styles from "./OrgLoginForm.module.scss";

export default function OrgLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [visible, setVisible] = useState(false);

  const cx = classNames.bind(styles);

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    SystemUserLoginRequest({ email, password, otp });
    console.log(email, password, otp);
  };

  const SystemUserLoginRequest = async ({ email, password, otp }: any) => {
    const URL = "http://localhost:5000/orguser-login";
    try {
      const resp = await axios.post(URL, { email, password, otp });
      console.log(resp);
      if (resp.status === 200) {
        navigate("/sys-dashboard");
        alert("Login Sucessfully");
      }
      return resp.data;
    } catch (err) {
      console.log(err);
      alert("Invalid Login Credential");
      return "Login Error";
    }
  };

  const handleChange = () => {
    setVisible(!visible);
  };

  return (
    <div className={cx("logcontainerr")}>
      <form>
        <div className={cx("wrapperr")}>
          <h2>Login Form</h2>
          <div className={cx("formboxx")}>
            <div>
            <label>Email: </label>
            <Input
              type="email"
              placeholder="E-mail"
              style={{ marginBottom: 10, width: 300 }}
              value={email}
              onChange={(value) => setEmail(value)}
              required
            />
            </div>
            <div>
              <label>Password: </label>
              <InputGroup style={{ marginBottom: 15 }}>
                <Input
                  type={visible === false ? "password" : "text"}
                  placeholder={"password"}
                  style={{ width: 260 }}
                  onChange={(value) => {
                    setPassword(value);
                  }}
                  required
                />
                <InputGroup.Addon onClick={handleChange}>
                  {visible ? <EyeIcon /> : <EyeSlashIcon />}
                </InputGroup.Addon>
              </InputGroup>
            </div>
            <div className={styles.otpcontainer}>
              <Input
                type="text"
                placeholder="OTP"
                style={{ marginBottom: 10, marginRight: 10, width: 184 }}
                value={otp}
                onChange={(value) => setOTP(value)}
              />
              <Button
                type="submit"
                appearance="ghost"
                size="lg"
                style={{ height: 35 }}
              >
                Send OTP
              </Button>
            </div>
            <Button
              type="submit"
              appearance="primary"
              size="lg"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
