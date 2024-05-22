import { Input, Button, SelectPicker } from "rsuite";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Loader } from 'rsuite';
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./OrgLoginForm.module.scss";
import { Cookies } from "react-cookie";

export default function OrgLoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [organizationValue, setOrganizationValue] = useState("");
  const [org, setOrg] = useState([]);

  const cx = classNames.bind(styles);

  const navigate = useNavigate();
  const cookies = new Cookies();
  const orglist = org.map((item) => ({ label: item, value: item }));

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    cookies.set("organizationValue", organizationValue);
    OrgUserLoginRequest({ email, otp });
  };

  const OrgUserLoginRequest = async ({ email, otp }: any) => {
    const URL = "http://localhost:5000/orguser-login";
    try {
      const resp = await axios.post(URL, { email, otp });
      cookies.set("email", email);
      cookies.set("accessToken", resp.data.accessToken);

      navigate("/org-dashboard");
      return;
    } catch (err) {
      console.log(err);
      alert("Invalid Login Credential");
      return;
    }
  };

  const userOrganizations = async (email: string) => {
    const URL = "http://localhost:5000/find-user";
    try {
      const api = await axios.post(URL, { email: email });
      setOrg(api.data.data);
      console.log("API data:", api.data);
    } catch (err) {
      console.error("Error in userOrganizations:", err);
      setOrg([]);
    }
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const URL = `http://localhost:5000/mail/${email}`;
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const resp = await axios.get(URL, { headers });
      setOtpSent(true);
      return resp;
    } catch (err) {
      console.log(err);
      return {
        data: {
          msg: "Can't send Otp",
        },
        status: "400",
      };
    }
  };

  // useEffect(() => {
  //   if (email) {
  //     userOrganizations(email);
  //   }
  // }, [email]);

  return (
    <div className={cx("logcontainerr")}>
      <form>
        <div className={cx("wrapperr")}>
          <h2>Login Form</h2>
          <div className={cx("formboxx")}>
            <div>
              {/* <label>Email: </label> */}
              <Input
                type="email"
                placeholder="E-mail"
                style={{ marginBottom: 10, marginTop: 10, width: 300 }}
                value={email}
                onChange={(value) => setEmail(value)}
                required
              />
            </div>
            <SelectPicker
              data={orglist}
              onOpen={() => userOrganizations(email)}
              onChange={(value: string | undefined | void | null) => {
                if (typeof value === "string") {
                  setOrganizationValue(value);
                }
                console.log("orgnaization value-->>>", value);
              }}
              searchable={false}
              style={{ width: 300, marginBottom: 10, marginTop: 14 }}
              placeholder="Select Organizations"
            />
            <br />

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
  );
}
