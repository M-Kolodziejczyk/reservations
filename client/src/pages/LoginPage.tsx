import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { login } from "../slices/auth";
import { clearMessage } from "../slices/auth";
import { AuthInput } from "../slices/interface";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import styles from "./LoginPage.module.scss";

function LoginPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearMessage());
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const initialValues: AuthInput = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email jest nie poprawny")
      .required("Email jest wymagany"),
    password: Yup.string()
      .min(6, "Hasło musi mieć minimum 6 znaków")
      .required("Hasło jest wymagane"),
  });

  const handleLogin = (formValue: AuthInput) => {
    setLoading(true);
    dispatch(login(formValue))
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  if (isAuthenticated) {
    return <Navigate to="/reservations" />;
  }

  return (
    <div className={styles.loginPage}>
      <h1>Logowanie</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <Field name="email" type="text" className={styles.formInput} />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.errorMessage}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Hasło</label>
            <Field
              name="password"
              type="password"
              className={styles.formInput}
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.errorMessage}
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              <span>Login</span>
            </button>
          </div>
        </Form>
      </Formik>
      {message && (
        <div
          // className={`${styles.message} ${
          //   successful ? styles.success : styles.danger
          // }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
