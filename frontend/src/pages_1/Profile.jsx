import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <h4 className="text-center">Você precisa fazer login.</h4>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Perfil do Usuário</h4>
      </div>
      <div className="card-body">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email ?? "não definido"}</p>
      </div>
    </div>
  );
}