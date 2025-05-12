/* eslint-disable prettier/prettier */
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { validationResult } from "express-validator";

const app = express();
app.use(bodyParser.json());
app.use(morgan("tiny"));

Routes.forEach((route) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app as any)[route.method](
    route.route,
    ...route.validation,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    async (req: Request, res: Response, next: Function) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default app;
