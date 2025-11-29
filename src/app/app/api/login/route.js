import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { no_empleado, contrasena } = await req.json();

    // 1. Validaciones básicas
    if (!no_empleado || !contrasena) {
      return NextResponse.json(
        {
          success: false,
          message: "No. empleado y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // 2. Buscar en usuarios
    const [rows] = await db.execute(
      "SELECT no_empleado, contrasena FROM usuarios WHERE no_empleado = ?",
      [no_empleado]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // 3. Comparar contraseña (en producción sería con hash)
    if (user.contrasena !== contrasena) {
      return NextResponse.json(
        { success: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // 4. Traer info del empleado (opcional, pero nice)
    const [empleados] = await db.execute(
      `SELECT 
         e.no_empleado,
         e.nombre,
         e.apellido,
         p.nombre_puesto AS puesto,
         a.nombre_area AS area
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto = p.id_puesto
       LEFT JOIN areas a ON e.area = a.id_area
       WHERE e.no_empleado = ?`,
      [no_empleado]
    );

    let empleadoInfo;

    if (empleados.length > 0) {
      empleadoInfo = empleados[0];
    } else {
      empleadoInfo = {
        no_empleado: user.no_empleado,
        nombre: "Sin nombre",
        apellido: "",
        puesto: null,
        area: null,
      };
    }

    // 5. Respuesta OK
    return NextResponse.json({
      success: true,
      message: "Login exitoso",
      user: empleadoInfo,
    });
  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json(
      { success: false, message: "Error interno en el login" },
      { status: 500 }
    );
  }
}