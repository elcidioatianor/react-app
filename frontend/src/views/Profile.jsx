import { useNavigate } from "react-router-dom";
import { useState } from "react";

//import reactLogo from '../assets/react.svg'
import bootstrapLogo from "../assets/bootstrap-logo.svg";
//import * as bootstrap from '../assets/js/bootstrap.esm.min.js'
//import '../assets/css/bootstrap.min.css'
import "../assets/css/profile.css";

//import {submitForm} from '../assets/js/signin.js'

export function Profile() {
    let [user, setUser] = useState(null);
    let [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    let storedUser = localStorage.getItem("user");
    let navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return "U";

        const parts = name.trim().split(/\s+/);

        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    try {
        let parsed = JSON.parse(storedUser);
        setUser(parser);
        console.log(parsed);
    } catch (err) {
        console.error(err);
        navigate("/login"); //redirect to login page
    } finally {
        setLoading(false);
    }

    return (
        <main className="form-signin w-100 m-auto">
            {user.avatarUrl && !imgError ? (
                <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    onError={() => setImgError(true)}
                    className="rounded-circle border"
                    style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                    }}
                />
            ) : (
                <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center border"
                    style={{
                        width: "80px",
                        height: "80px",
                        fontWeight: "bold",
                    }}
                >
                    {getInitials(user.username)}
                </div>
            )}
            <h1 className="h3 mb-3 fw-normal">Olá, {user.name}</h1>

            <div className="list-group my-3">
                <div className="list-group-item">
                    Nome: <strong>{user.name}</strong>
                </div>
                <div className="list-group-item">
                    Email: <strong>{user.email}</strong>
                </div>
            </div>
        </main>
    );
}
