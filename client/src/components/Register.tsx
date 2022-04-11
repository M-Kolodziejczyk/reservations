import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/auth";
import { AuthInput } from "../slices/interface";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import styles from "./Register.module.scss";

interface RegisterInput extends AuthInput {
  passwordConfirm: string;
}

const Register = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState(false);
  const { message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearMessage());

    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const initialValues: RegisterInput = {
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email jest nie poprawny")
      .required("Email jest wymagany"),
    password: Yup.string()
      .min(6, "Hasło musi mieć minimum 6 znaków")
      .required("Hasło jest wymagane"),
    passwordConfirm: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Hasła nie są takie same"
    ),
  });

  const handleRegister = (formValue: AuthInput) => {
    setSuccessful(false);
    setLoading(true);

    dispatch(register(formValue))
      .unwrap()
      .then(() => {
        setSuccessful(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setSuccessful(false);
      });
  };

  return (
    <div className={styles.registerPage}>
      <h1>Rejestracja</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email
            </label>
            <Field name="email" type="email" className={styles.formInput} />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.errorMessage}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Hasło
            </label>
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
            <label className={styles.formLabel} htmlFor="passwordConfirm">
              Powtórz hasło
            </label>
            <Field
              name="passwordConfirm"
              type="password"
              className={styles.formInput}
            />
            <ErrorMessage
              name="passwordConfirm"
              component="div"
              className={styles.errorMessage}
            />
          </div>
          <div className={styles.formGroup}>
            <button type="submit" className={styles.button} disabled={loading}>
              Zarejestruj
            </button>
          </div>
        </Form>
      </Formik>
      {message && (
        <div
          className={`${styles.message} ${
            successful ? styles.success : styles.danger
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
};
export default Register;
