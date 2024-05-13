import { useState } from 'react';
import React from 'react'
import { Button, Input } from 'rsuite';
import styles from './SysRegisterForm.module.scss';
import axios from 'axios';
import classNames from "classnames/bind";
import { Link } from 'react-router-dom';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDOB] = useState('');

  const cx = classNames.bind(styles);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { firstName, lastName, email, password, dob };
    console.log(formData);
    try {
      const response = await axios.post('http://localhost:5000/sysuser-register', {
        body: JSON.stringify({ firstName, lastName, email, password, dob }),
      });
      console.log(response);
      //const data = await response();
      // console.log(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className={cx("regcontainer")}>
      <form onSubmit={handleSubmit}>
      <div className={cx("wrapper")}>
        <h2>Registration</h2>
        <div className={cx("formbox")}>
          <Input
            type={"text"}
            placeholder={"First Name"}
            style={{marginBottom:10,width:300}}
            onChange={(value) => { setFirstName(value) }}
            required={true}
          />
          <Input
            type={"text"}
            placeholder={"Last Name"}
            style={{marginBottom:10,width:300}}
            onChange={(value) => { setLastName(value) }}
            required={true}
          />
          <Input
            type={"email"}
            placeholder={"E-mail"}
            style={{marginBottom:10,width:300}}
            onChange={(value) => { setEmail(value) }}
            required={true}
          />
          <Input
            type={"password"}
            placeholder={"password"}
            style={{marginBottom:10,width:300}}
            onChange={(value) => { setPassword(value) }}
            required={true}
          />
          <Input
            type={'date'}
            style={{marginBottom:10,width:300}}
            onChange={(value) => { setDOB(value) }}
            required={true}
          /> 
          <Button type="submit" appearance="primary" size="lg">
            Register
          </Button>
          <label style={{marginTop:20}}>Already a User?<Link to={"/sys-login"} style={{marginLeft:3}}>Login</Link></label>
        </div>
      </div>
      </form>
    </div>
  );
}
