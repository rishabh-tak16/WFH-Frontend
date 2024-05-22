import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";

import SysLoginForm from "../../organisms/SysLoginForm/SysLoginForm";

export default function SysLoginpage() {
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.get('accessToken');
    if (token) {
      navigate('/sys-dashboard');
    }
  }, []);
  return (
    <div>
      <SysLoginForm />
    </div>
  );
}
