import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

function Dashboard() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => console.log("CSRF token récupéré", Cookies.get("csrftoken")))
      .catch((err) => console.error("Erreur récupération CSRF :", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/get_tickets/", {
      withCredentials: true,
    });
    get_tickets();
  }, []);

  function get_tickets() {
    axios
      .get("http://localhost:8000/api/get_tickets/", { withCredentials: true })
      .then((response) => {
        console.log("Données reçues :", response.data); // Vérification
        setTableData(response.data.tickets || []); // Correction ici
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/dashboard",
        formData,
        {
          withCredentials: true, // ✅ Active les cookies
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.response);
      // alert("Ticket créé avec succès !");
      get_tickets();
      setFormData({ title: "", description: "" }); // Réinitialiser le formulaire
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Impossible de créer le ticket"
      );
    }
  }

  const messageColor = {
    color: "red",
  };

  return (
    <>
      <div className="mainPage">
        {/* Header */}
        <div className="header container-fluid shadow">
          <div className="container d-flex justify-content-between my-2 py-3">
            <h2>Tickets</h2>
            <h4>
              Profil <FaUserCircle size={35} />
            </h4>
          </div>
        </div>
        {/* Header */}

        {/* Body page, tickets creation */}
        <div className="container shadow-sm p-3 mb-5 bg-body rounded mt-5">
          <div className="ticket-title mb-5">
            <h4>Nouveau tickets</h4>
            <hr className="custom-hr" />
          </div>

          <div className="ticket-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Panne ordinateur"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Dites nous ce qui ne va pas..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="text-center mt-3">
                <p style={messageColor}>{message}</p>
              </div>
              <div className="text-center mt-2">
                <button type="submit" className="btn btn-success">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Section de filtre */}
        {/* Section de filtre */}
        <div className="container shadow-sm p-3 mb-5 bg-body rounded mt-5">
          <div className="filter-object d-flex flex-wrap justify-content-between gap-3">
            {/* Filtre par statut */}
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filtrer par statut
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Ouvert
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    En cours
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Fermé
                  </a>
                </li>
              </ul>
            </div>

            {/* Filtre par priorité */}
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filtrer par priorité
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Basse
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Moyenne
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Haute
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Critique
                  </a>
                </li>
              </ul>
            </div>

            {/* Filtre par date */}
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filtrer par date
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Aujourd'hui
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Cette semaine
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Ce mois-ci
                  </a>
                </li>
              </ul>
            </div>

            {/* Recherche par mot-clé */}
            <div className="d-flex align-items-end">
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher un mot-clé"
              />
              <button className="btn btn-primary ms-2">Rechercher</button>
            </div>
          </div>
        </div>
        {/* Section de filtre */}

        {/* Affichage des tickets */}
        <div className="container-fluid shadow-sm p-3 mb-5 bg-body rounded mt-5">
          <div className="ticket-title mb-5">
            <h4>Mes tickets</h4>
            <hr className="custom-hr" />
          </div>

          <div className="ticket-body">
            <table className="table table-light table-hover">
              <thead>
                <tr>
                  <th scope="col">Titre</th>
                  <th scope="col">Description</th>
                  <th scope="col">Statut</th>
                  <th scope="col">Date de création</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <p>Aucun ticket disponible.</p>
                ) : (
                  tableData.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.title}</td>
                      <td>{ticket.description}</td>
                      <td>{ticket.status}</td>
                      <td>{ticket.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Affichage des tickets */}

        {/* Body page, tickets creation */}
      </div>
    </>
  );
}

export default Dashboard;
