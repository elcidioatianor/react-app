//import { Link } from "react-router-dom";
import { useContext } from "react";
//import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";
/*
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()

  // controle para fallback quando a imagem falhar
  const [imgError, setImgError] = useState(false)

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">MyApp</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
        </ul>

        {user ? (
          <div className="d-flex align-items-center gap-3">
            
            {// Avatar 
            {user.avatarUrl && !imgError ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                onError={() => setImgError(true)}
                className="rounded-circle border"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center border"
                style={{
                  width: "40px",
                  height: "40px",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                {getInitials(user.username)}
              </div>
            )}

            <span className="text-white fw-semibold">{user.username}</span>

            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
            <Link className="btn btn-light btn-sm" to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
*/

import { Link, NavLink } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function Navbar() {
  const { user, logout } = useAuth()

  // Função para gerar iniciais
  const getInitials = (name) => {
    if (!name) return "U"

    const parts = name.trim().split(" ")

    // Se tiver mais de uma palavra → pega primeira letra de duas
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }

    // Senão só a primeira letra
    return parts[0][0].toUpperCase()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          MeuApp
        </Link>

        {/* Botão hamburguer */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">

          {/* Links à esquerda */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/learn">Learn</NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Área direita */}
          <ul className="navbar-nav ms-auto">

            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </>
            ) : (
              <>
                {/* Avatar + dropdown */}
                <li className="nav-item dropdown">

                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {/* AVATAR */}
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center me-2"
                      style={{
                        width: "38px",
                        height: "38px",
                        backgroundColor: "#ffffff",
                        color: "#0d6efd",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {getInitials(user.username)}
                    </div>

                    {user.username}
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Meu Perfil
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider" /></li>

                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>

        </div>
      </div>
    </nav>
  )
}
