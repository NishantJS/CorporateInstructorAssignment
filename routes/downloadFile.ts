import express, { Router } from "express";
const download = Router();

download.use(express.static('public'));

download.get("*", async (_req, res) => {
  return res.status(404).send({
    status: "error",
    message: "File not Found!"
  })
})

export default download;