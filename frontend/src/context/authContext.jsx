import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // verifica se existe token armazenado
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {//se existe, usar os dados
		setUser(JSON.parse(storedUser));
	}
  }, []);


  // Registro real (com chamada API)
  const register = async (formData) => {
    try {
      const response = await api.post("/auth/register", formData);

      // Backend deverá retornar { user, accessToken, refreshToken }
      const { user: newUser, accessToken, refreshToken } = response.data;

      // salvar token e usuário
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", accessToken);
		localStorage.setItem("refreshToken", refreshToken)
      setUser(newUser);

      return { success: true };

    } catch (err) {
		console.error(err);
		return { success: false, message: err.response?.data?.message };
    }
  };


  const login = async (formData) => {
	try {
    const response = await api.post("/auth/login", formData)

    const { user, accessToken, refreshToken } = response.data

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", accessToken)
    localStorage.setItem("refreshToken", refreshToken)

    	setUser(user)

    	return user
	} catch (err) {
		console.error(err);
		return { success: false, message: err.response?.data?.message };
	}
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  //Funções serão usadas nas páginas de autenticação 
  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//3 - Criar hook para usar o Auth Context > ../hooks/useAuth.js