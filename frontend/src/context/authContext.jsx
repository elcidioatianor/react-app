import { createContext, useState, useEffect } from "react";
import {xhr} from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

  // verifica se existe usuário armazenado
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {//se existe, usar os dados
		try {
			setUser(JSON.parse(storedUser));
		} catch (err) {
			console.log(err) //user is not a valid object
		}
	}

	setLoading(false)
  }, []);


  // Registro real (com chamada API)
  const register = async (formData) => {
	let res = null;

    try {
		res = await xhr.post("/auth/register", {
			body: formData
		});

		if (res.status ===201) {
      // Backend deverá retornar { user, accessToken, refreshToken }
      const { user, accessToken, refreshToken } = res.data;

      // salvar token e usuário
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
		localStorage.setItem("refreshToken", refreshToken)

      setUser(user);

      return { success: true };
		} else {
			throw new Error(res.data.message);
		}
    } catch (err) {
		console.error(err)
		throw err;
    }
  };


  const login = async (formData) => {
	let res = null;

	try {
    	res = await xhr.post("/auth/login", {body: formData})
	console.log(res)
	if (res.status ===200) {
    const { user, accessToken, refreshToken } = res.data

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", accessToken)
    localStorage.setItem("refreshToken", refreshToken)

    	setUser(user)

    	return {success: true}
	} else {
		throw new Error(res.data.message)
	}
	} catch (err) {
		console.error(err);
		throw err;
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