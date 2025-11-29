import { NextResponse } from "next/server";

// --- Base de datos simulada temporal (reemplázala por tu DB real) ---
const usuarios = [
  {
    id: 1,
    usuario: "1",
    password: "12345678",
    nombre: "Usuario Administrador",
    area: "Almacen",
    puesto: "Supervisor",
  },
];

export async function POST(req) {
  try {
    const { usuario, password } = await req.json();

    if (!usuario || !password) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos" },
        { status: 400 }
      );
    }

    // Busca al usuario (puede ser reemplazado por SQL luego)
    const user = usuarios.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // ★ ÉXITO ★
    return NextResponse.json(
      {
        ok: true,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          area: user.area,
          puesto: user.puesto,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en /api/login:", error);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
