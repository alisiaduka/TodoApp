import Button from "@mui/material/Button";
import Api from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Api.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      navigate("/");
    }
  };

  return (
    <Button variant="contained" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
