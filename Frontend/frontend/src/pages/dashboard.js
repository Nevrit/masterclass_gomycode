import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

function Dashboard() {
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => console.log("CSRF token récupéré", Cookies.get("csrftoken")))
      .catch((err) => console.error("Erreur récupération CSRF :", err));
  }, []);

  const [formData, setFormData] = useState({ title: "", description: "" });
  // const [tableData, setTableData] = useState([]);

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
        {/* Body page, tickets creation */}
      </div>
    </>
  );
}

export default Dashboard;
