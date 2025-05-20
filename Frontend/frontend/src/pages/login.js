import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";


axios.defaults.withCredentials = true;


function Login() {

    useEffect(() => {
    axios
      .get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => console.log("CSRF token récupéré", Cookies.get("csrftoken")))
      .catch((err) => console.error("Erreur récupération CSRF :", err));
  }, []);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post("http://localhost:8000/api/login/", formData, 
                {
                    headers: {
                        "X-CSRFToken": Cookies.get("csrftoken"),
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if(response.data.token) {
                localStorage.setItem("authToken", response.data.token);
            }
            setMessage(response.data.message);
            alert(`Connexion réussie !`);
            window.location.href = "/dashboard";  // Redirection après la connexion réussie
        } catch (error) {
            setMessage(error.response?.data?.message || "Identifiants incorrects");
        }
    };

    return (
        <main className="main-page">
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="forms-login shadow-lg p-4 bg-light rounded border" style={{ maxWidth: "400px" }}>
                    <h3 className="text-center mb-4">Connexion</h3>
                    <form onSubmit={handleSubmit}>
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
                            <button type="submit" className="btn btn-primary btn-lg w-100">Se connecter</button>
                        </div>
                        <div className="text-center mt-3">
                            <p>Vous n'avez pas de compte ? <a href="/register" className="text-primary fw-bold">Inscrivez-vous</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Login;