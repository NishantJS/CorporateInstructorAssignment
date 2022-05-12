import { Router } from "express";
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"

const storage = Router();

storage.get("/", async (req, res) => {
  const { token } = req.signedCookies;
  const user = req?.user;

  if (token || user) {
    return res.status(200).json({
      "status": "ok",
      "message": "Token already exists!"
    })
  }

  const payload = {
    user: randomUUID()
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