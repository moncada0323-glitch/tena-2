"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password: contrasena }),
      });

      // Si el servidor responde HTML (404/500) .json() fallará
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Respuesta no JSON del servidor:", text);
        setError("Respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      if (!res.ok || data.ok === false) {
        setError(data.error || data.message || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      // Login OK: data.usuario o data.user según tu API
      // Redirige según área/puesto si lo necesitas
      // Ejemplo simple: al dashboard principal
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-6 rounded-2xl shadow-md w-full max-w-sm flex flex-col space-y-3"
      >
        <h2 className="text-xl font-bold text-center mb-1 text-white">Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="border rounded-md p-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className="border rounded-md p-2"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
