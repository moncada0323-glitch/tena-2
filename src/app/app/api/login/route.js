// src/app/api/login/route.js
import { NextResponse } from "next/server";

const usuarios = [
  { id: 1, usuario: "1", password: "12345678", nombre: "Nataly Pacheco", area: "CEO", puesto: "CEO" }
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { usuario, password } = body ?? {};

    if (!usuario || !password) {
      return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 });
    }

    const user = usuarios.find(u => u.usuario === String(usuario) && u.password === String(password));
    if (!user) {
      return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    // Respuesta de ejemplo (quita password antes de devolver)
    const { password: _, ...userSafe } = user;
    return NextResponse.json({ ok: true, user: userSafe }, { status: 200 });
  } catch (err) {
    console.error("Error en /api/login:", err);
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}
