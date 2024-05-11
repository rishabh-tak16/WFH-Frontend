import { useState } from 'react';
import React from 'react'
import { Button, Input } from 'rsuite';
import styles from './RegisterForm.module.scss';
import './RegisterForm.module.scss';
import axios from 'axios';
import classNames from "classnames/bind";

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
        body: JSON.stringify(formData),
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

      <div className={styles.wrapper}>
        <h2>Registration</h2>
        <div className={styles.formbox}>

          <label>First Name :</label>
          <Input
            type={"text"}
            placeholder={"First Name"}
            onChange={(value) => { setFirstName(value) }}
          />
          <label>Last Name :</label>
          <Input
            type={"text"}
            placeholder={"Last Name"}
            onChange={(value) => { setLastName(value) }}
          />
          <label>E-mail :</label>
          <Input
            type={"email"}
            placeholder={"E-mail"}
            onChange={(value) => { setEmail(value) }}
          />
          <label>Password :</label>
          <Input
            type={"password"}
            placeholder={"password"}
            onChange={(value) => { setPassword(value) }}
          />
          <label>DOB :</label>
          <Input
            type='date'
            onChange={(value) => { setDOB(value) }}
          /> 
          <Button type="submit" appearance="primary" size="lg">
            Sign Up
          </Button>
        </div>
      </div>
          
    </div>
  );
}
