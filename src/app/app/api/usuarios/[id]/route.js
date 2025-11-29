import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const { id } = params; // carpeta [id] => params.id

    const [rows] = await db.execute(
      "SELECT no_empleado, contrasena AS contraseña FROM usuarios WHERE no_empleado = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectDB();
    const { id } = params; // aquí también

    const { contraseña } = await req.json();

    if (!contraseña) {
      return NextResponse.json(
        { ok: false, message: "La nueva contraseña es obligatoria" },
        { status: 400 }
      );
    }

    await db.execute(
      "UPDATE usuarios SET contrasena = ? WHERE no_empleado = ?",
      [contraseña, id]
    );

    return NextResponse.json({
      ok: true,
      message: "Contraseña actualizada",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectDB();
    const { id } = params;

    await db.execute("DELETE FROM usuarios WHERE no_empleado = ?", [id]);

    return NextResponse.json({
      ok: true,
      message: "Usuario eliminado",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}