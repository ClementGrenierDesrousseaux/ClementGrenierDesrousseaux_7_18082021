import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Registration() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  let history = useHistory();

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(20).required(),
    email: Yup.string().required().email(),
    password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "You must have at least one uppercase letter, one lowercase letter and one number"), //Une lettre majuscule, une lettre minuscule et 1 chiffre
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      console.log(data);
      history.push("/")
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="registrationContainer">
          <label>Prénom + Nom : </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John Doe...)"
          />

          <label>Email : </label>
          <ErrorMessage name="email" component="span" />
          <Field
            autocomplete="off"
            type="email"
            id="inputCreatePost"
            name="email"
            placeholder="(Ex. john.doe@groupomania.com...)"
          />

          <label>Mot de passe : </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autocomplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Votre mot de passe"
          />

          <button type="submit">S'inscrire</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
