import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface ExistingUser extends RowDataPacket {
  id: number;
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const connection = await getConnection();

    // Перевіряємо чи є такий користувач
    const [existing] = await connection.execute<ExistingUser[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await connection.end();
      return new Response(JSON.stringify({ error: "User already exists." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Додаємо користувача
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    await connection.end();

    const userId = result.insertId;

    // Генеруємо токен
    const token = jwt.sign(
      { id: userId, name, email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({
        message: "User registered successfully.",
        token,
        user: { id: userId, name, email },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Register error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
