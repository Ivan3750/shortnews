import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// --- Отримати userId з токена ---
function getUserIdFromAuth(req: Request): number | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

interface UserRead extends RowDataPacket {
  news_id: number;
}

interface UserInfo extends RowDataPacket {
  read_count: number;
}

// --- Позначити новину як прочитану ---
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { newsId } = await req.json();
    if (!newsId)
      return NextResponse.json({ error: "No newsId" }, { status: 400 });

    const conn = await getConnection();

    // 1️⃣ Додаємо запис (уникаємо дублювання)
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT IGNORE INTO user_read (user_id, news_id) VALUES (?, ?)`,
      [userId, newsId]
    );

    // 2️⃣ Якщо реально вставили новий запис — перерахуємо кількість
    if (result.affectedRows > 0) {
      const [[countResult]] = await conn.execute<RowDataPacket[]>(
        `SELECT COUNT(*) AS total FROM user_read WHERE user_id = ?`,
        [userId]
      );

      const totalRead = (countResult as any).total as number;

      await conn.execute<ResultSetHeader>(
        `UPDATE users SET read_count = ? WHERE id = ?`,
        [totalRead, userId]
      );
    }

    // 3️⃣ Повертаємо актуальний список
    const [rows] = await conn.execute<UserRead[]>(
      `SELECT news_id FROM user_read WHERE user_id = ?`,
      [userId]
    );

    await conn.end();

    const readNews = rows.map((r) => r.news_id);

    return NextResponse.json({
      userId,
      readCount: readNews.length,
      readNews,
    });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// --- Отримати список прочитаних ---
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conn = await getConnection();

    const [rows] = await conn.execute<UserRead[]>(
      `SELECT news_id FROM user_read WHERE user_id = ?`,
      [userId]
    );

    const [[userInfo]] = await conn.execute<UserInfo[]>(
      `SELECT read_count FROM users WHERE id = ?`,
      [userId]
    );

    await conn.end();

    const readNews = rows.map((r) => r.news_id);
    const readCount = userInfo?.read_count ?? readNews.length ?? 0;

    return NextResponse.json({ userId, readCount, readNews });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
