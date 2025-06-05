import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("");
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      setStatus("Connexion réussie !");
      setTimeout(() => navigate("/dashboard"), 700);
    } else {
      setStatus(data.message || "Erreur de connexion");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <form onSubmit={handleLogin} className="w-96 flex flex-col gap-4 bg-white/10 p-8 rounded-3xl items-center shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Connexion</h2>
        <input
          type="email"
          value={email}
          placeholder="Email"
          className="p-2 rounded w-full"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Mot de passe"
          className="p-2 rounded w-full"
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg shadow hover:scale-105 transition"
        >
          Se connecter
        </button>
        {status && <div className="mt-4 text-white">{status}</div>}
      </form>
    </section>
  );
}