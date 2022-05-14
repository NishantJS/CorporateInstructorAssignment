import { Router } from "express";
import { UserType } from "../custom/definations";
import util from "util"
import { exec as execSync } from "child_process";
import { checkPath } from "./checkPath";
import { createHash } from "crypto"
import { writeFile, access } from "fs/promises"
import { pathToFileURL } from "url"
import { join, parse } from "path";
const exec = util.promisify(execSync);

const mergeVideo = Router();

const doesExists = async (path: string) => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

mergeVideo.post("/", async (req: UserType, res) => {
  try {
    const { video_file_path_list } = req.body;
    if (!(video_file_path_list && video_file_path_list?.length)) throw new Error("Please provide path for videos");

    const user = req.user?.user!;

    const filesToArray = async () => {
      let videoFileArr: string[] = [];
      for (const video_path of video_file_path_list) {
        const { error: vid_err, path: video, message: vid_msg } = checkPath(video_path, user, false, true);
        const { base } = parse(video)
        if (vid_err || !video) throw new Error(vid_msg);
        if (!await doesExists(video)) throw new Error("File not found! 🚫" + video);

        videoFileArr = [...videoFileArr, `file ${base}`]
      };

      return videoFileArr;
    }

    const files = await filesToArray();
    if (files.length < 2) throw new Error("Atleast 2 files need to be provided to merge")
    const file = files.join("\n");

    const hash = createHash('md5').update(files.join("")).digest('hex');
    const newVideo = join("public", user, `${hash}.mp4`)

    await writeFile(`${newVideo}.txt`, file);
    const isSaved = await doesExists(newVideo);

    const videoPath = pathToFileURL(newVideo).pathname.split("CorporateTraining/").pop();

    if (!isSaved) {
      const command = `ffmpeg -safe 0 -f concat -i ${videoPath}.txt -c copy ${videoPath}`

      await exec(command);
    }


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

export default mergeVideo;