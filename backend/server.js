// absensi/backend/server.js

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

try {
    await db.authenticate();
    console.log('alhamdullilah database terkoneksi');
} catch (error) {
    console.error(error);
}

app.use(cors({ credentials:true, origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  const quotes = [
    '📌 setiap baris kode yang aku buat ada nama kamu di dalamnya. -ebi',
    '📌 server terhubung itu memang indah, tapi tak seindah senyuman kamu. -ebi',
    '📌 Mantap! Server udah jalan, tapi kapan nih kita jalan berdua? -ebi',
    '📌 Siap-siap jadi programmer terbaik di keluarga kecil kita nanti! -ebi'
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  console.log(`Server jalan di http://localhost:${PORT} yaa`);
  console.log(randomQuote);
});