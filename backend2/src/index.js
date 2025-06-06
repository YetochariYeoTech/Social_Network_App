import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import CookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(CookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
