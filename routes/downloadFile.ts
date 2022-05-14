import { Router, static as Static } from "express";
const download = Router();

download.use(Static('public'));

download.get("/download_file", async (req, res) => {
  try {
    try {
      const file_path: any = req.query?.file_path;
      if (!file_path) throw new Error();
      return res.download(file_path)
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "File not Found!"
      })
    }
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "File not Found!"
    })
  }
})

download.get("*", async (_req, res) => {
  return res.status(404).send({
    status: "error",
    message: "File not Found!"
  })
})

export default download;