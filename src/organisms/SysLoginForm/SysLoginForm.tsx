import { useState } from 'react';
import { Input, Button } from "rsuite";
import classNames from "classnames/bind";
import styles from "./SysLoginForm.module.scss"
import { Link } from "react-router-dom";

export default function SysLoginform() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDOB] = useState('');
  const [otp, setOTP] = useState('');

  const cx = classNames.bind(styles);

  return (
    <div className={cx("logcontainer")}>
      <form >
        <div className={cx("wrapper")}>
          <h2>Login Form</h2>
          <div className={cx("formbox")}>
            <Input
              type={"email"}
              placeholder={"E-mail"}
              style={{ marginBottom: 10, width: 300 }}
              onChange={(value) => { setEmail(value) }}
              required={true}
            />
            <Input
              type={"password"}
              placeholder={"password"}
              style={{ marginBottom: 10, width: 300 }}
              onChange={(value) => { setPassword(value) }}
              required={true}
            />
            <div className={styles.otpcontainer}>
              <Input
                type="text"
                placeholder="OTP"
                style={{ marginBottom: 10, marginRight: 10, width: 184 }}
                value={otp}
                onChange={(value) => setOTP(value)}
                required
              />
              <Button type="submit" appearance="ghost" size="lg" style={{ height: 35 }}>
                Send OTP
              </Button>
            </div>
            <Button type="submit" appearance="primary" size="lg">
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
