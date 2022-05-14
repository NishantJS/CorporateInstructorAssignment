import { Router } from "express";
import storage from './createStorage';
import { UserType } from "../custom/definations"
import passport from 'passport';
import "../auth/jwt";
import upload from "./uploadFile";
import download from "./downloadFile";
import text2Speech from "./text2Speech";
import createVideo from "./createVideo";
import replaceAudio from "./replaceAudio";
import mergeVideo from "./mergeVideo";
import showUploaded from "./showUploaded";

const api = Router();

api.use("/public", download)
api.use(passport.initialize());

api.use("/create_new_storage", storage)
api.use(
  ["/upload_file", "/my_upload_file", "/text_file_to_audio", "/merge_image_and_audio", "/merge_video_and_audio", "/merge_all_video", "/my_upload_file"],
  passport.authenticate("jwt", { session: false }),
  async (req: UserType, res, next) => {
    try {
      const { token } = req.signedCookies;
      const user = req?.user?.user;
      if (!token || !user) throw new Error("Unauthorized");
      next();
      return;
    } catch (error) {
      return res.status(401).json({
        error: true,
        data: error?.message || "Error checking user id",
      });
    }
  }
);

api.use("/upload_file", upload);
api.use("/text_file_to_audio", text2Speech);
api.use("/merge_image_and_audio", createVideo);
api.use("/merge_video_and_audio", replaceAudio);
api.use("/merge_all_video", mergeVideo);
api.use("/my_upload_file", showUploaded);
api.use("/", download)


export default api;