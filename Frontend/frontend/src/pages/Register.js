import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

function Register() {
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => console.log("CSRF token récupéré", Cookies.get("csrftoken")))
      .catch((err) => console.error("Erreur récupération CSRF :", err));
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/register/",
        formData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      alert(
        "Inscription réussie ! Vous allez être redirigé vers la page de connexion."
      );
      window.location.href = "/login"; // Redirection après validation
    } catch (error) {
      console.log("CSRF depuis cookies :", Cookies.get("csrftoken"));
      setMessage(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <main className="main-page">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="forms-signup shadow-lg p-4 bg-light rounded border"
          style={{ maxWidth: "480px" }}
        >
          <h3 className="text-center mb-4">Inscription</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                placeholder="Exemple : Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                className="form-control"
                placeholder="Exemple : John"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nom utilisateur</label>
              <input
                type="text"
                className="form-control"
                placeholder="Exemple : NevGhost"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Adresse mail</label>
              <input
                type="email"
                className="form-control"
                placeholder="Exemple : exemple@exemple.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                placeholder="*****"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {message && <p style={{ color: "red" }}>{message}</p>}
            <div className="text-center">
              <button type="submit" className="btn btn-success btn-lg w-100">
                S'inscrire
              </button>
            </div>
            <div className="text-center mt-3">
              <p>
                Vous avez déjà un compte ?{" "}
                <a href="/login" className="text-primary fw-bold">
                  Connectez-vous
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
