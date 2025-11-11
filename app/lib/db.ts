import fs from "fs";
import mysql from "mysql2/promise";

const sslCA = process.env.DB_SSL_CA
  ? { ca: fs.readFileSync(process.env.DB_SSL_CA) }
  : undefined;

export const dbconfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: sslCA,
};

export async function getConnection() {
  return await mysql.createConnection(dbconfig);
}
