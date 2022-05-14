import { UserType } from "../custom/definations";
import { Router } from "express";
import multer from "multer";
import { extname } from "path";
import { mkdirSync } from "fs";
import { pathToFileURL } from "url";

const upload = Router();

const storage = multer.diskStorage({
  destination: (req: UserType, _file, cb): void => {
    const path = `public/${req.user?.user}/`;
    mkdirSync(path, { recursive: true })
    cb(null, path);
  },
  filename: (_req, file, cb): void => {
    const ext = extname(file.originalname)
    cb(null, file.fieldname + ext);
  }
})

const saveFile = multer({
  storage: storage, fileFilter: function (_req, file, callback) {

    const supportedFormats = ["png", "jpg", "gif", "jpeg", "txt", "mp3", "mp4"];

    const ext: string = extname(file.originalname).split(".")[1];
    const isSupported = supportedFormats.some(element => element === ext);

    if (!isSupported)
      return callback(new Error(`${ext} file format not supported`))

    callback(null, true)
  },
  limits: {
    fileSize: 5e+7 //50mb in bytes
  }
})

upload.post("/", saveFile.array("my_file", 3), async (req: UserType, res) => {
  try {
    const formData = req.files as { [fieldname: string]: Express.Multer.File[] };

    let length = Object.keys(req.files || {}).length;
    if (!length) throw new Error("Please provide files to upload!");
    const paths = []

    for (let index = 0; index < length; index++) {
      const current = formData[index] as unknown as Express.Multer.File;
      paths.push(pathToFileURL(current.path).href.split("/CorporateTraining/")[1])
    }

    return res.status(200).json({
      "status": "ok",
      "file_path": paths
    });
  } catch (error) {
    console.error(error, "hello")
    return res.status(500).json({ status: "error", message: error?.message })
  }
})

export default upload;