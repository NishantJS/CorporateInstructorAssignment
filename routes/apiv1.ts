import { Router } from "express";
import storage from './createStorage';
import { UserType } from "../custom/definations"
import passport from 'passport';
import "../auth/jwt";

const api = Router();

api.use(passport.initialize());

api.use("/create_new_storage", storage)
api.use(
  ["/upload_file", "/my_upload_file"],
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

export default api;