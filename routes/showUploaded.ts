import { Router } from "express";
import { UserType } from "../custom/definations";
import { readdir } from "fs/promises"
import { join } from "path";

const showUploaded = Router();

showUploaded.get("/", async (req: UserType, res) => {
  try {
    const user = req.user?.user!;
    const path = join("public", user)
    console.log(path)
    const files = await readdir(path);
    return res.status(200).json({ status: "ok", data: files })
  } catch (error) {
    return res.status(500).json({ status: "error", message: error?.message })
  }
})

export default showUploaded