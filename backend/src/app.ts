import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { router } from "./routes";
import { handleAuthrizationError } from "./utils/mappers/protect-routes";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
    allowedHeaders: ["Content-type", "Authorization"],
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use("/api", router, handleAuthrizationError);
