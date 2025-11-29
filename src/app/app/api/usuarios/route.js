import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      "SELECT no_empleado, contrasena AS contraseña FROM usuarios"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectDB();
    const { no_empleado, contraseña } = await req.json();

    if (!no_empleado || !contraseña) {
      return NextResponse.json(
        { ok: false, message: "no_empleado y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const [exists] = await db.execute(
      "SELECT no_empleado FROM usuarios WHERE no_empleado = ?",
      [no_empleado]
    );

    if (exists.length > 0) {
      return NextResponse.json(
        { ok: false, message: "Usuario ya existe" },
        { status: 400 }
      );
    }

    // Insertar
    await db.execute(
      "INSERT INTO usuarios (no_empleado, contrasena) VALUES (?, ?)",
      [no_empleado, contraseña]
    );

    return NextResponse.json({ ok: true, message: "Usuario creado" });
  } catch (err) {
    console.error("Error al crear usuario:", err);
    return NextResponse.json(
      { ok: false, message: "Error al crear usuario" },
      { status: 500 }
    );
  }
}