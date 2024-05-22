import { useState } from "react";
import { Input, Button } from "rsuite";
import axios from "axios";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookie from 'js-cookie'

import styles from "./SysLoginForm.module.scss";


export default function SysLoginform() {

  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const cx = classNames.bind(styles);

  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    SysUserLoginRequest({ email, otp });
    console.log(email, otp);
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const URL = `http://localhost:5000/mail/${email}`
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const resp = await axios.get(URL,{ headers });
      setOtpSent(true);
      return resp;
  
    } catch (err) {
      console.log(err);
      return {
        data: {
          msg: "Can't send Otp"
        }, 
        status: "400"
      }
    }
  }

  const SysUserLoginRequest = async ({ email, password, otp }: any) => {
    const URL = "http://localhost:5000/sysuser-login";
    try {
      const resp = await axios.post(
        URL,
        { email, otp }
      );
      console.log(resp);
        toast.success("Login Sucessfully")
        console.log(resp.data.accessToken);
        Cookie.set('accessToken', resp.data.accessToken)
        navigate("/sys-dashboard");
        
    } catch (err) {
      console.log(err);
      toast.error("Invalid Login Credential")
      return "Login Error";
    }
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
              </div>
              <div className={styles.otpcontainer}>
                </div>
                {!otpSent ? (
              <Button
                type="submit"
                appearance="ghost"
                size="lg"
                style={{ height: 35 }}
                onClick={sendOtp}
              >
                Send OTP
              </Button>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="OTP"
                  style={{ marginBottom: 10, width: 300 }}
                  value={otp}
                  onChange={(value) => setOTP(value)}
                />
                <Button
                  type="submit"
                  appearance="primary"
                  size="lg"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              </>
            )}
                {/* <Button
                  type="submit"
                  appearance="ghost"
                  size="lg"
                  style={{ height: 35 }}
                  onClick={sendOtp}
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
              </Button> */}
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
