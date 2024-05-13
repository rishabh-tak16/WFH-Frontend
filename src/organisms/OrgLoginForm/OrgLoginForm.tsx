import { Input, Button } from 'rsuite';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from "./OrgLoginForm.module.scss";

export default function OrgLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');

    const navigate = useNavigate()

    const handleSubmit = () => {
    };

    return (
        <div className={styles.logcontainerr}>
            <form onSubmit={handleSubmit}>
                <div className={styles.wrapperr}>
                    <h2>Login Form</h2>
                    <div className={styles.formboxx}>
                        <Input
                            type="email"
                            placeholder="E-mail"
                            style={{ marginBottom: 10, width: 300 }}
                            value={email}
                            onChange={(value) => setEmail(value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            style={{ marginBottom: 10, width: 300 }}
                            value={password}
                            onChange={(value) => setPassword(value)}
                            required
                        />
                        <div className={styles.otpcontainer}>
                        <Input
                            type="text"
                            placeholder="OTP"
                            style={{ marginBottom: 10, marginRight:10,width: 184 }}
                            value={otp}
                            onChange={(value) => setOTP(value)}
                            required
                        />
                        <Button type="submit" appearance="ghost" size="lg" style={{height: 35}}>
                            Send OTP
                        </Button>
                        </div>
                        <Button type="submit" appearance="primary" size="lg" onClick={() => { navigate("/sys-dashboard") }}>
                            Login
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
