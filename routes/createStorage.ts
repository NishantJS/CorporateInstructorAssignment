import { Router } from "express";
import jwt from "jsonwebtoken"
import { randomBytes } from "crypto"
import { UserType } from "../custom/definations";

const storage = Router();

storage.post("/", async (req: UserType, res) => {
  const { token } = req.signedCookies;
  const user = req?.user?.user;

  if (token && user) {
    return res.status(200).json({
      "status": "ok",
      "message": "Token already exists!"
    })
  }

  const payload = {
    user: randomBytes(8).toString("base64url")
  }

  const newToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN!),
  });

  return res
    .status(200)
    .cookie("token", newToken, {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: Number.parseInt(process.env.JWT_EXPIRES_IN!),
    })
    .json({
      "status": "ok",
      "message": "Storage Created Successfully"
    })
})

storage.delete("/", async (_req, res) => {
  try {

    return res.status(204).clearCookie("token", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: Number.parseInt(process.env.JWT_EXPIRES_IN!),
    })
      .json({
        "status": "ok",
        "message": "Cookie deleted! 🍪"
      })
  } catch (error) {
    return res
      .status(200)
      .cookie("token", "", {
        signed: true,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 0
      })
      .json({
        "status": "ok",
        "message": "Storage Created Successfully"
      })
  }
})

export default storage;
