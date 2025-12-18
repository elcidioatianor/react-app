import {useState} from "react" 
import { Link, NavLink } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function Navbar() {
  const { user, logout } = useAuth()

  // controle para fallback quando a imagem falhar
  const [imgError, setImgError] = useState(false)

  // Função para gerar iniciais
	//TODO: MAIS TARDE USAR USER.NAME
  const getInitials = (name) => {
    if (!name) return "U"

    const parts = name.trim().split(/\s+/)

    // Se tiver mais de uma palavra → pega primeira letra de duas
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }

    // Senão só a primeira letra
    return parts[0][0].toUpperCase()
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark" aria-label="Main navigation">
		 <div className="container-fluid">

		{/* Botão hambúrguer*/}
        <button className="navbar-toggler p-0 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#sideNav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
		
		
        {/* Logo */}
        <Link className="navbar-brand me-auto" to="/">MeuApp</Link>
		  
		{/* Avatar e dropdown */} 
		{user ? (
         <div className="navbar-nav ms-auto dropdown">
			  <button className="d-block link-body-emphasis text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
				{user.avatarUrl && !imgError ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                onError={() => setImgError(true)}
                className="rounded-circle border"
                style={{ 
                  width: "32px",
                  height: "32px",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center border"
                style={{
                  width: "32px",
                  height: "32px",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}
              >
                {getInitials(user.username)}
              </div>
            )}
              </button>
              <ul className="dropdown-menu text-small shadow">
                <li><Link className="dropdown-item" to="#">New project...</Link></li>
                <li><Link className="dropdown-item" to="#">Settings</Link></li>
                <li><Link className="dropdown-item" to="#">Profile</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button type="button" className="dropdown-item" onClick={logout}>Sair</button></li>
              </ul>
            </div>
		) : (
			<ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
			</ul>
		)}
		</div>

		{/* Barra lateral */}
        <div className="navbar-collapse offcanvas-collapse" id="sideNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/dashboard">Dashboard</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/notifications">Notifications</NavLink>
            </li>

            <li className="nav-item">
				<NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/profile">Profile</NavLink>
			</li>

            <li className="nav-item">
              <NavLink className={({isActive}) => isActive ? "nav-link active" : "nav-link"} to="/accounts">Switch account</NavLink>
            </li>
          </ul>
        </div>
    </nav>
  )
}
