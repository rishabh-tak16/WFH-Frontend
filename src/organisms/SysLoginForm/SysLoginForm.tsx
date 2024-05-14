import { useState } from "react";
import { Input, Button, InputGroup } from "rsuite";
import axios from "axios";
import classNames from "classnames/bind";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import styles from "./SysLoginForm.module.scss";


export default function SysLoginform() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [visible, setVisible] = useState(false);

  const cx = classNames.bind(styles);

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    OrganizationUserLoginRequest({ email, password, otp });
    console.log(email, password, otp);
  };

  const OrganizationUserLoginRequest = async ({ email, password, otp }: any) => {
    const URL = "http://localhost:5000/sysuser-login";
    try {
      const resp = await axios.post(
        URL,
        { email, password, otp }
      );
      console.log(resp);
      if (resp.status === 200) {
        toast.success("Login Sucessfully")
        setTimeout(() => { navigate("/sys-dashboard") }, 2000);

      }
      return resp.data;
    } catch (err) {
      console.log(err);
      toast.error("Invalid Login Credential")
      return "Login Error";
    }
  };

  const handleChange = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className={cx("logcontainer")}>
        <form >
          <div className={cx("wrapper")}>
            <h2>Login Form</h2>
            <div className={cx("formbox")}>
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
      <ToastContainer />
    </>
  );
}
