import { Router } from "express";
import { UserType } from "../custom/definations";
import { spawn } from "child_process";
import { checkPath } from "./checkPath";
import { createHash } from "crypto"
import { access } from "fs/promises"
import { join } from "path"
import { pathToFileURL } from "url"

const replaceAudio = Router();

const doesExists = async (path: string) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

replaceAudio.post("/", async (req: UserType, res) => {
  try {
    const { video_file_path, audio_file_path } = req.body;
    if (!video_file_path || !audio_file_path) throw new Error("Please provide path for both image and audio");

    const user = req.user?.user!;

    const { error: vid_err, path: video, message: vid_msg } = checkPath(video_file_path, user);
    const { error: wav_err, path: audio, message: wav_msg } = checkPath(audio_file_path, user);

    if (vid_err || !video) throw new Error(vid_msg);
    if (wav_err || !audio) throw new Error(wav_msg);
    if (!await doesExists(video) || !await doesExists(audio)) throw new Error("File not found! 🚫")

    const filename = video + audio;
    const hash = createHash('md5').update(filename).digest('hex');
    const newVideo = join("public", user, `${hash}.mp4`)
    const isSaved = await doesExists(newVideo);

    if (!isSaved) {
      const commandFlags = ['-i', video, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', newVideo]
      spawn("ffmpeg", commandFlags);
    }

    const videoPath = pathToFileURL(newVideo).pathname.split("CorporateTraining/").pop();

    return res.status(200).json({
      status: "ok",
      message: "Video and Audio Merged Successfully",
      video_file_path: videoPath
    })

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

export default replaceAudio;