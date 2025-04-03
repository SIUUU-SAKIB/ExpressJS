const express = require("express");
const app = express();
const port = process.env.PORT || 7000;
const cors = require("cors");
const upload = require("./src/utils/multer.js");
const cloudinary = require(`./src/utils/cloudinary.js`);
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
// middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.post(`/upload`, upload.single(`image`), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "no file provided" });
  }
  try {
    const response = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({ status: true, url: response.secure_url });
  } catch (error) {
    console.log(`Something went wrong`);
    res.status(404).json({ error: `File upload unsuccessfull` });
  }
});

app.get(`/`, (req, res) => {
  res.send(`server is working`);
});
app.listen(port, () =>
  console.log(`SERVER IN WORKING ON http://localhost:${port}`)
);
