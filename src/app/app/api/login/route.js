import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validaciones básicas
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Aquí asumo que 'username' es el no_empleado
    const [rows] = await db.execute(
      `
      SELECT 
        u.no_empleado,
        u.contrasena,
        e.nombre,
        e.apellido,
        p.nombre_puesto AS puesto,
        a.nombre_area AS area
      FROM usuarios u
      INNER JOIN empleados e ON e.no_empleado = u.no_empleado
      LEFT JOIN puestos p ON e.puesto = p.id_puesto
      LEFT JOIN areas a ON e.area = a.id_area
      WHERE u.no_empleado = ?
      `,
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Comparación directa de contraseña (en real → usar hash)
    if (user.contrasena !== password) {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Armamos objeto limpio sin la contraseña
    const userSafe = {
      no_empleado: user.no_empleado,
      nombre: user.nombre,
      apellido: user.apellido,
      puesto: user.puesto,
      area: user.area,
    };

    return NextResponse.json({
      success: true,
      message: "Login exitoso",
      user: userSafe,
    });
  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json(
      { success: false, message: "Error interno en el login" },
      { status: 500 }
    );
  }
}