import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTodoForm from "../components/AddTodoForm";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
};

const Dashboard = () => {
  return (
    <AuthGuard>
      <AddTodoForm />
    </AuthGuard>
  );
};

export default Dashboard;
