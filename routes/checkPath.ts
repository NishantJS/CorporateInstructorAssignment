import { format, join, parse } from "path"

export const checkPath = (file_path: string, user?: string, isT2S = false, isMP4 = false) => {
  try {
    if (!user) throw new Error("User unauthorized!")
    if (!file_path) throw new Error("Please provide file path!")

    const { dir: directory, base, ext } = parse(file_path);
    const [publicDir, userDir] = directory.split("/")
    const dir = join(publicDir, userDir)

    if (publicDir !== "public" || userDir !== user) throw new Error("Invalid directory or path!")
    if (isT2S && ext !== ".txt") throw new Error("Only text files can be converted to speech!");
    if (isMP4 && ext !== ".mp4") throw new Error("Only mp4 files can be used to merge!");

    return {
      error: false,
      path: format({ root: "/", dir, base, ext })
    }
  } catch (error) {
    return { error: true, message: error?.message, path: "" }
  }
}