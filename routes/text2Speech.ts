import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { parse, format } from "path";
import { TextToSpeechClient } from "@google-cloud/text-to-speech"
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

    const textPath = pathToFileURL(path).pathname.split("CorporateTraining/").pop()!;

    const text = await readFile(textPath, 'utf8');

    const audio = format({ ...parse(path), base: '', ext: '.mp3' })
    const audioPath = pathToFileURL(audio).pathname.split("CorporateTraining/").pop()!;

    const client = new TextToSpeechClient();
    const request: any = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    await writeFile(audioPath, response.audioContent!, 'binary');

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
