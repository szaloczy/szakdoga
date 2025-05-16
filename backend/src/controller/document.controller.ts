import { AppDataSource } from "../data-source";
import { Document } from "../entity/Document";
import { Controller } from "./base.controller";

export class DocumentController extends Controller {
  repository = AppDataSource.getRepository(Document);
}
