import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { handleTimestamp } from "./api";

dotenv.config();

const { PORT } = process.env;

const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (_, res) {
  res.sendFile(path.resolve(__dirname, "..", "views", "index.html"));
});

// your first API endpoint...
app.get("/api/:input", handleTimestamp);

// listen for requests :)
app.listen(PORT, function () {
  console.log(`Your app is listening on port ${PORT}`);
});
