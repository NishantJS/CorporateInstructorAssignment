import express from "express";
import dotenv from "dotenv";
dotenv.config();
import logger from "morgan";
import cookieParser from "cookie-parser";
import api from "./routes/apiv1";
import { json, urlencoded } from "body-parser"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(logger("dev"));
app.use(json())
app.use(urlencoded({ extended: true }))

app.use("/", api)

const port = parseInt(process.env.PORT || "3000");
app.listen(port, (): void => console.log(`server [running] on [port:${port}]`));