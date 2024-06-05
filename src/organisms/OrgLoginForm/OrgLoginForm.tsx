import { Input, Button, SelectPicker, Loader } from "rsuite";
import { useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./OrgLoginForm.module.scss";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrgLoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [organizationValue, setOrganizationValue] = useState("");
  const [org, setOrg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const cx = classNames.bind(styles);

  const navigate = useNavigate();
  const orglist = org.map((item) => ({ label: item, value: item }));

  const validateEmail = (email:string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e:React.SyntheticEvent) => {
    e.preventDefault();
    if (!organizationValue) {
      toast.error("Please Select Organization");
      return;
    }
    if (!email) {
      setEmailError("Email field cannot be empty");
      return;
    }
    Cookies.set("organizationValue", organizationValue);
    Cookies.set("type","orguser");
    OrgUserLoginRequest({ email, otp });
  };

  // const OrgUserLoginRequest = async ({ email, otp }:any) => {
  //   const URL = "http://localhost:5000/orguser-login";
  //   try {
  //     const resp = await axios.post(URL, { email, otp });
  //     Cookies.set("email", email);
  //     Cookies.set("accessToken", resp.data.accessToken);
  //     navigate("/org/dashboard");
  //   } catch (err) {
  //     console.log(err);
  //     alert("Invalid Login Credential");
  //   }
  // };

  const OrgUserLoginRequest = async ({ email, otp }:any) => {
    const URL = `http://localhost:5000/orguser-login?email=${email}&otp=${otp}`;
    try {
      const resp = await axios.get(URL);
      Cookies.set("email", email);
      Cookies.set("accessToken", resp.data.accessToken);
      navigate("/org/dashboard");
    } catch (err) {
      console.log(err);
      alert("Invalid Login Credential");
    }
  };

  const userOrganizations = async (email:string) => {
    if (!email) {
      setEmailError("Email field cannot be empty");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid Email Format");
      return;
    }
    setEmailError("");
    setLoading(true);
    const URL = "http://localhost:5000/find-user";
    try {
      const api = await axios.post(URL, { email: email });
      setOrg(api.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error in userOrganizations:", err);
      setOrg([]);
      setLoading(false);
    }
  };

  const sendOtp = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Email field cannot be empty");
      return;
    }
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
      toast.error("Can't send OTP");
      setLoading(false);
    }
  };

  return (
    <div className={cx("logcontainerr")}>
      <form>
        <div className={cx("wrapperr")}>
          <h2>Login</h2>
          <div className={cx("formboxx")}>
            <div>
              <label>Email<span style={{ color: "red" }}>*</span></label>
              <Input
                id="email"
                type="email"
                placeholder="E-mail"
                style={{ marginBottom: 12, marginTop: 8, width: 300 }}
                value={email}
                onChange={(value) => setEmail(value)}
                required
              />
              {emailError && <div style={{ color: "red", marginBottom: 10 }}>{emailError}</div>}
            </div>
            <div>
              <label >Select Organization<span style={{ color: "red" }}>*</span></label><br/>
              <SelectPicker
                id="organization"
                data={orglist}
                onOpen={() => userOrganizations(email)}
                onChange={(value) => {
                  if (typeof value === "string") {
                    setOrganizationValue(value);
                  }
                }}
                searchable={false}
                style={{ width: 300, marginBottom: 2, marginTop: 10 }}
                placeholder="Select Organizations"
              />
            </div>
            <br />
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
                <div style={{marginTop:-5}}>
                <label>OTP<span style={{ color: "red" }}>*</span></label>
                <Input
                  type="text"
                  placeholder="OTP"
                  style={{ marginTop:8,marginBottom: 10, width: 300 }}
                  value={otp}
                  onChange={(value) => setOTP(value)}
                />
                </div>
                <Button
                  type="submit"
                  appearance="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <Loader content="Logging in..." /> : "Login"}
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
