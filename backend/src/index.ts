import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { handleError } from "./middleware/handleError";
import { port } from "./config";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(morgan("tiny"));

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next,
            );
            res.json(result);
          } catch (error) {
            next(error);
          }
        },
      );
    });

    app.use(handleError);
    app.listen(port);

    // insert new users for test
    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27,
      }),
    );

    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24,
      }),
    );

    console.log(`Express server has started on port ${port}.`);
  })
  .catch((error) => console.log(error));
