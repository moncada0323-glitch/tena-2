import { NextResponse } from "next/server";


export async function POST(req) {
  const { username, password } = await req.json();

  const user = usuarios.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json({ success: false, message: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Login exitoso", userId: user.id });
}
