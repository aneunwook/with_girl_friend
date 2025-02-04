import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);

    return <button onClick={logout}>로그아웃</button>;
}

export default LogoutButton;