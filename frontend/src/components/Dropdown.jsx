/**
 *. USAGE
                    <Link
                                            to="/dashboard"
                                            className="dropdown-item"
                                        >
                                            📊 Dashboard
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="dropdown-item"
                                        >
                                            👤 Perfil
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="dropdown-item"
                                        >
                                            ⚙️ Configurações
                                        </Link>
                                        <hr className="dropdown-divider" />
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item logout-item"
                                        >
                                            🚪 Sair
                                        </button>
*/
           
function Dropdown({ children }) {
	//CLASSES: dropdown-item, dropdown-divider
	return (
		<div className="dropdown">
			<div className="dropdown-menu">
				{children}
			</div
		</div>
	)
}

export {
	Dropdown
}