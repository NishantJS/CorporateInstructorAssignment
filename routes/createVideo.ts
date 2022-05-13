import { Router } from "express";
import { UserType } from "../custom/definations";
import util from "util"
import { exec as execSync } from "child_process";
import { checkPath } from "./checkPath";
const exec = util.promisify(execSync);

const createVideo = Router();

createVideo.post("/", async (req: UserType, res) => {
  try {
    const { image_file_path, audio_file_path } = req.body;
    if (!image_file_path || !audio_file_path) throw new Error("Please provide path for both image and audio");

    const user = req.user?.user;

    const { error: img_err, path: img_path, message: img_msg } = checkPath(image_file_path, user);
    const { error: wav_err, path: wav_path, message: wav_msg } = checkPath(audio_file_path, user);

    if (img_err) throw new Error(img_msg);
    if (wav_err) throw new Error(wav_msg);

    const { rootPath, filename: image_filename, fileext } = img_path!;
    const { filename: audio_filename } = wav_path!;
    const filename = `${rootPath}${image_filename}`

    const audio = `${rootPath}${audio_filename}.wav`;
    const image = `${filename}.${fileext}`;
    const video = `${filename}.mkv`;

    const command = `ffmpeg -loop 1 -f image2 -r 2 -i ${image} -i ${audio} -c:v libx264 -c:a copy -shortest ${video}`

    await exec(command);

    return res.status(200).json({
      status: "ok",
      message: "Video Created Successfully",
      video_file_path: video
    })

  } catch (error) {
    return res.status(500).json({ status: "error", message: error?.message })
  }
})

export default createVideo;