import { Router } from "express";
import { UserType } from "../custom/definations";
import util from "util"
import { exec as execSync } from "child_process";
import { checkPath } from "./checkPath";
import { createHash } from "crypto"
import { access } from "fs/promises"
import { join } from "path"
import { pathToFileURL } from "url"
const exec = util.promisify(execSync);

const createVideo = Router();

const doesExists = async (path: string) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

createVideo.post("/", async (req: UserType, res) => {
  try {
    const { image_file_path, audio_file_path } = req.body;
    if (!image_file_path || !audio_file_path) throw new Error("Please provide path for both image and audio");

    const user = req.user?.user!;

    const { error: img_err, path: image, message: img_msg } = checkPath(image_file_path, user);
    const { error: wav_err, path: audio, message: wav_msg } = checkPath(audio_file_path, user);

    if (img_err || !image) throw new Error(img_msg);
    if (wav_err || !audio) throw new Error(wav_msg);
    if (!await doesExists(image) || !await doesExists(audio)) throw new Error("File not found! 🚫")

    const filename = image + audio;
    const hash = createHash('md5').update(filename).digest('hex');
    const video = join("public", user, `${hash}.mp4`)
    const isSaved = await doesExists(video);

    if (!isSaved) {
      const command = `ffmpeg -loop 1 -i ${image} -i ${audio} -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest ${video}`
      await exec(command);
    }

    const videoPath = pathToFileURL(video).pathname.split("CorporateTraining/").pop();

    return res.status(200).json({
      status: "ok",
      message: "Video Created Successfully",
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

export default createVideo;