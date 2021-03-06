import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { logout } from "./slices/auth";
import { useAppDispatch, useAppSelector } from "./hooks/redux";

import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ReservationPage from "./pages/ReservationPage";
import PrivateRoute from "./components/PrivateRoute";

import styles from "./App.module.scss";

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div className={styles.app}>
        <nav className={styles.nav}>
          {isAuthenticated ? (
            <a href="/" className={styles.navBtn} onClick={logoutHandler}>
              Wyloguj
            </a>
          ) : (
            <>
              <Link to="/" className={styles.navBtn}>
                Zaloguj
              </Link>

              <Link to="/register" className={styles.navBtn}>
                Zarejestruj
              </Link>
            </>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/reservations"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ReservationPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
