import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Image/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors());

app.post("/upload", upload.single("file"), async (req, res) => {
  // console.log(req.body.desc);

  const fileManager = new GoogleAIFileManager(
    process.env.VITE_REACT_AI_API_KEY
  );

  const uploadResult = await fileManager.uploadFile(
    `./Image/` + req.file.filename,
    {
      mimeType: req.file.mimetype,
      displayName: req.file.originalname,
    }
  );
  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
  );

  const genAI = new GoogleGenerativeAI(
    process.env.VITE_REACT_AI_API_KEY
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    req.body.desc,
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
  // console.log(result.response.text());
  res.send(result.response.text());
});

app.get("/", (req, res) => {
  res.send("Hello world!");
  // console.log(process.env.VITE_REACT_AI_API_KEY);
  
});
app.listen(4001, () => {
  console.log("server is running...");
});
