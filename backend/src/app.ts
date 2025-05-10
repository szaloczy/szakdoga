/* eslint-disable prettier/prettier */
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { handleError } from "./middleware/handleError";
import { validationResult } from "express-validator";

const app = express();
app.use(bodyParser.json());
app.use(morgan("tiny"));

Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    ...route.validation,
    async (req: Request, res: Response, next: Function) => {
      try {  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const result = await new (route.controller as any)()[route.action](
          req,
          res,
          next
        );
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );
});

app.use(handleError);

export default app;
