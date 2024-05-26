//import styles from './OrgLoginPage.module.scss'
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import OrgLoginForm from "../../organisms/OrgLoginForm/OrgLoginForm";

export default function OrgLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      navigate('/org/dashboard');
    }
  }, []);

  return (
    <div>
      <OrgLoginForm />
    </div>
  );
}
