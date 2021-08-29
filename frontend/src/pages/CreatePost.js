import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);

  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
  };
  {
    /*Si l'utilisateur n'est pas identifié, renvoi à la page de connexion*/
  }
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);
  {
    /*Utilisation de Yup pour simplifier les vérifications des formulaires*/
  }
  const validationSchema = Yup.object().shape({
    title: Yup.string().min(3).max(50).required(),
    postText: Yup.string().min(5).max(230).required(),
  });
  {
    /*Envoi des données au backend avec en header le token, puis en réponse renvoi à la page d'accueil*/
  }
  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        history.push("/");
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Nom de l'article: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Mon premier article ...)"
          />
          <label>Contenu de l'article: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autocomplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Je suis en train d'écrire mon premier article !! ...)"
          />

          <button type="submit">Envoyer</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
