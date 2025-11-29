"use client";



import { useState } from "react";



export default function LoginPage() {

  const [no_empleado, setNoEmpleado] = useState("");

  const [contrasena, setContrasena] = useState("");

  const [mensaje, setMensaje] = useState("");

  const [error, setError] = useState("");



  const handleSubmit = async (e) => {

    e.preventDefault();

    setMensaje("");

    setError("");



    try {

      const res = await fetch("/app/api/login", {

        // Si tu ruta está en src/app/api/login/route.js, cambia a "/api/login"

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ no_empleado, contrasena }),

      });



      const data = await res.json();



      if (!res.ok || !data.success) {

        setError(data.message || "Error al iniciar sesión");

        return;

      }



      // AQUÍ USAMOS BACKTICKS (``) PARA INTERPOLAR VARIABLES

     setMensaje(`Bienvenido ${data.user.nombre} ${data.user.apellido}`)

    } catch (err) {

      console.error(err);

      setError("Error de conexión con el servidor");

    }

  };



  // OJO: el return del componente va FUERA de handleSubmit

  return (

    <div style={{ maxWidth: "400px", margin: "40px auto" }}>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: "10px" }}>

          <label>

            No. Empleado:

            <input

              type="text"

              value={no_empleado}

              onChange={(e) => setNoEmpleado(e.target.value)}

              style={{ width: "100%" }}

            />

          </label>

        </div>



        <div style={{ marginBottom: "10px" }}>

          <label>

            Contraseña:

            <input

              type="password"

              value={contrasena}

              onChange={(e) => setContrasena(e.target.value)}

              style={{ width: "100%" }}

            />

          </label>

        </div>



        <button type="submit">Entrar</button>

      </form>



      {error && (

        <p style={{ color: "red", marginTop: "10px" }}>

          {error}

        </p>

      )}

      {mensaje && (

        <p style={{ color: "green", marginTop: "10px" }}>

          {mensaje}

        </p>

      )}

    </div>

  );

}