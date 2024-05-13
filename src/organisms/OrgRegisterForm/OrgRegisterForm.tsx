import { Input,Button, } from 'rsuite'
import { useState} from 'react';
import { Link } from 'react-router-dom';
import styles from "./OrgRegisterForm.module.scss"
import './OrgRegisterForm.module.scss'

export default function OrgRegisterForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDOB] = useState('');

    const handleSubmit = async () =>{
    }

  return (
    <>
      <div className={styles.orgregcontainer}>
        <form onSubmit={handleSubmit}>
        <div className={styles.wrapper}>
          <h2>Registration</h2>
          <div className={styles.formbox}>
            <Input
              type={"text"}
              placeholder={"First Name"}
              style={{marginBottom:10,width:300}}
              onChange={(value) => { setFirstName(value) }}
              required
            />
            <Input
              type={"text"}
              placeholder={"Last Name"}
              style={{marginBottom:10,width:300}}
              onChange={(value) => { setLastName(value) }}
              required
            />
            <Input
              type={"email"}
              placeholder={"E-mail"}
              style={{marginBottom:10,width:300}}
              onChange={(value) => { setEmail(value) }}
              required
            />
            <Input
              type={"password"}
              placeholder={"password"}
              style={{marginBottom:10,width:300}}
              onChange={(value) => { setPassword(value) }}
              required
            />
            <div>
            <label>DOB:</label>
            <Input
              type={'date'}
              style={{marginBottom:10,width:300}}
              onChange={(value) => { setDOB(value) }}
              required
            /> 
            </div>
            <div><label>DOj:</label>
            <Input
              type={'date'}
              style={{marginBottom:10,width:300}}
              onChange={(value) => { setDOB(value) }}
              required
            /> </div>
            <Button type="submit" appearance="primary" size="lg">
              Register
            </Button>
            <label style={{marginTop:20}}>Already a User?<Link to={"/org-login"} style={{marginLeft:3}}>Login</Link></label>
          </div>
        </div>
        </form>
      </div>
    </>
  )
}
