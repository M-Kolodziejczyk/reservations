import { Navigate } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  children: JSX.Element;
}

const PrivateRoute = ({ isAuthenticated, children }: Props) => {
  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
