import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            login(data);
            // 👇 MOSTRAR TOKEN
            console.log("TOKEN:", data.token);
            // 👇 DECODIFICAR TOKEN (opcional)
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            console.log("PAYLOAD:", payload);
            console.log(localStorage.getItem("user"));
            navigate("/home");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-600 to-orange-800">
            <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-white/20">
            <h1 className="text-3xl font-bold text-white text-center mb-8">
                Bienvenido
            </h1>
            {error && (
                <div className="mb-6 text-sm text-center bg-red-500/20 text-white p-3 rounded-lg border border-red-300/40">
                {error}
                </div>
            )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-white text-sm">Correo</label>
                        <input
                            type="email"
                            value={email}
                            name="email" // <-- Agrega el atributo name
                            autoComplete="username" // <-- Ayuda a la extensión
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 p-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-white text-sm">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            name="password" // <-- Agrega el atributo name
                            autoComplete="current-password" // <-- Ayuda a la extensión
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 p-3 rounded-lg bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                    type="submit"
                    className="w-full py-3 bg-white text-orange-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;