//Importation de tous les éléments nécessaires pour le fonctionnement de l'application

import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import logo from "./images/icon-left-font-monochrome-black.svg";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  //Vérifie si le token est valide, puis renvoi les informations de l'utilisateur
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  //Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  //Fonction pour supprimer son compte
  const deleteAccount = () => {
    axios
      .delete(`http://localhost:3001/auth/deleteAccount`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        localStorage.removeItem("accessToken");
        setAuthState({ username: "", id: 0, status: false });
      });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              <img src={logo} className="imgNavbar" />
              {/*Si l'utilisateur n'est pas identifié, fait apparaitre Connexion et Inscription,
              s'il est identifié fait apparaitre la page d'accueil et la page de création d'article*/}
              {!authState.status ? (
                <>
                  <Link to="/login">Connexion</Link>
                  <Link to="/registration">Inscription</Link>
                </>
              ) : (
                <>
                  <Link to="/">Fil d'actualité</Link>
                  <Link to="/createpost">Poster un article</Link>
                </>
              )}
            </div>
            {/*Boutons et informations de l'utilisateur (Nom, deconnexion, suppression du compte*/}
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Déconnexion</button>}
              {authState.status && (
                <button onClick={deleteAccount}>Supprimer mon compte</button>
              )}
            </div>
          </div>
          {/*Fait apparaitre les différentes pages selon l'url*/}
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
