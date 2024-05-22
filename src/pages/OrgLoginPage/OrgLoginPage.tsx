//import styles from './OrgLoginPage.module.scss'
import { useEffect } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import OrgLoginForm from "../../organisms/OrgLoginForm/OrgLoginForm";

export default function OrgLoginPage() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get('accessToken');
    if (token) {
      navigate('/');
    }
},[]);

  return (
    <div>
      <OrgLoginForm />
    </div>
  );
}
