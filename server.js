const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const PRIVATE_KEY = fs.readFileSync("./mux_private_key.pem", "utf-8");
const KEY_ID = process.env.MUX_KEY_ID;

app.get("/get-mux-token", (req, res) => {
//   const playbackId = req.query.playback_id;
const playbackId = req.query.playback_id?.trim();


  if (!playbackId) return res.status(400).send("Missing playback_id");

  const token = jwt.sign(
    {
      aud: "v",
      sub: playbackId,
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // valid for 15 minutes
    },
    PRIVATE_KEY,
    {
      algorithm: "RS256",
      keyid: KEY_ID,
    }
  );

  res.json({ token });
});

app.listen(port, () => console.log(`✅ JWT server running on port ${port}`));
