import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import api from "./routes/apiv1";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(logger("dev"));
app.use(
  cors({
    origin: "http://localhost:3000/",
    maxAge: 600,
    credentials: true,
  })
);


app.use("/api/v1/", api)
app.get("/", async (_req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

const port = parseInt(process.env.PORT || "5000");
app.listen(port, (): void => console.log(`server [running] on [port:${port}]`));