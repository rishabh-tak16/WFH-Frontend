import { useState } from "react";
import { Input, Button, Loader } from "rsuite";
import axios from "axios";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";

import styles from "./SysLoginForm.module.scss";

export default function SysLoginform() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const cx = classNames.bind(styles);
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    SysUserLoginRequest({ email, otp });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Invalid Email Format");
      return;
    }
    setEmailError("");
    setLoading(true);
    const URL = `http://localhost:5000/mail/${email}`;
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const resp = await axios.get(URL, { headers });
      setOtpSent(true);
      toast.success("OTP sent successfully!");
      setLoading(false);
      return resp;
    } catch (err) {
      console.log(err);
      toast.error("Invalid Email");
      setLoading(false);
      return {
        data: {
          msg: "Can't send Otp",
        },
        status: "400",
      };
    }
  };

  const SysUserLoginRequest = async ({ email, otp }: { email: string, otp: string }) => {
    const URL = `http://localhost:5000/sysuser-login?email=${email}&otp=${otp}`;
    try {
        const resp = await axios.get(URL);
        toast.success("Login Successfully");
        Cookie.set("accessToken", resp.data.accessToken);
        Cookie.set("type","sysuser");
        navigate("/sys/dashboard");
    } catch (err) {
        console.log(err);
        toast.error("Invalid Login Credential");
        return "Login Error";
    }
};


  return (
    <>
      <div className={cx("logcontainer")}>
        <form>
          <div className={cx("wrapper")}>
            <h2>Login</h2>
            <div className={cx("formbox")}>
              <div>
                <label>Email<span style={{ color: "red" }}>*</span></label>
                <Input
                  type="email"
                  placeholder="E-mail"
                  style={{ marginBottom: 10, marginTop:10,width: 300 }}
                  onChange={(value) => setEmail(value)}
                  required
                />
                {emailError && (
                  <div style={{ color: "red", marginBottom: 10 }}>{emailError}</div>
                )}
              </div>
              <div></div>
              <div className={styles.otpcontainer}></div>
              {!otpSent ? (
                <Button
                  type="submit"
                  appearance="ghost"
                  size="lg"
                  style={{ height: 35 }}
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? <Loader content="Sending..." /> : "Send OTP"}
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
                  <label style={{ marginTop: 10, marginBottom: 10 }}>
                    Didn't get the OTP?{" "}
                    <Link to="#" onClick={sendOtp}>
                      Resend
                    </Link>
                  </label>
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
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
