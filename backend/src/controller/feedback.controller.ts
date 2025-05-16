import { AppDataSource } from "../data-source";
import { Feedback } from "../entity/Feedback";
import { Controller } from "./base.controller";

export class FeedbackController extends Controller {
  repository = AppDataSource.getRepository(Feedback);
}
