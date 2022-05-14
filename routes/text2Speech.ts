import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { parse, format } from "path";
import text2wav from "text2wav"
import { pathToFileURL } from "url";
import { UserType } from "../custom/definations";
import { checkPath } from "./checkPath";

const text2Speech = Router();

text2Speech.post("/", async (req: UserType, res) => {
  try {

    const { file_path } = req.body;
    const user = req.user?.user;

    const { error, path, message } = checkPath(file_path, user, true);
    if (error || !path) throw new Error(message);

    const options = { voice: "en+f2", speed: 80, wordGap: 1000, pitch: 100 }

    const textPath = pathToFileURL(path).pathname.split("CorporateTraining/").pop()!;

    const data = await readFile(textPath, 'utf8');
    const out = await text2wav(data, options);

    const audio = format({ ...parse(path), base: '', ext: '.wav' })
    const audioPath = pathToFileURL(audio).pathname.split("CorporateTraining/").pop()!;

    writeFile(audioPath, Buffer.from(out.buffer));

    return res.status(200).json({
      status: "ok",
      message: "text to speech converted",
      audio_file_path: audioPath
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