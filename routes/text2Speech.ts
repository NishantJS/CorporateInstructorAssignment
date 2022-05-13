import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { extname } from "path";
import text2wav from "text2wav"
import { UserType } from "../custom/definations";

const text2Speech = Router();

text2Speech.post("/", async (req: UserType, res) => {
  try {
    const options = { voice: "en+f2", speed: 80, wordGap: 1000, pitch: 100 }

    const { file_path } = req.body;
    if (!file_path) throw new Error("Please provide file path!")

    const rootPath = `public/${req.user?.user}/`
    const filepath = file_path.split("/");

    if (filepath.length !== 3 || filepath[0] !== "public") throw new Error("Invalide path!")
    if (filepath[1] !== req.user?.user) throw new Error("You don't have permission to access other's files!");
    const [filename, fileext] = filepath[2].split(".")

    if (fileext !== "txt") throw new Error("Only text files can be converted to speech!");

    const data = await readFile(rootPath + filepath[2], 'utf8');

    const out = await text2wav(data, options);

    writeFile(`${rootPath}${filename}.wav`, Buffer.from(out.buffer));

    return res.status(200).json({
      status: "ok",
      message: "text to speech converted",
      audio_file_path: `${rootPath}${filename}.wav`
    });

  } catch (error) {
    const options = {
      status: "error",
      message: error?.message
    }
    if (error.code === "ENOENT") return res.status(404).json({ ...options, message: "File not found! 🚫" })
    if (error.code === "EISDIR") options.message = "File with provided path has been removed or you don't have access to it!"
    return res.status(500).json(options)
  }
})

export default text2Speech;