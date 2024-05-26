import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import SysLoginForm from "../../organisms/SysLoginForm/SysLoginForm";

export default function SysLoginpage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      navigate('/sys/dashboard');
    }
  }, []);
  return (
    <div>
      <SysLoginForm />
    </div>
  );
}
