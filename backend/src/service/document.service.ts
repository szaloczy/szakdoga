import { AppDataSource } from "../data-source";
import { Document } from "../entity/Document";
import { User } from "../entity/User";
import { In } from "typeorm";
import * as fs from "fs";
import * as path from "path";

export class DocumentService {
  private documentRepo = AppDataSource.getRepository(Document);
  private userRepo = AppDataSource.getRepository(User);
  private uploadDir = path.resolve(__dirname, "../../uploads");

  async getAllDocuments(): Promise<Document[]> {
    return await this.documentRepo.find({
      relations: ["user"],
      order: { uploadedAt: "DESC" }
    });
  }

  async saveDocument(userId: number, originalName: string, filename: string): Promise<Document> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    const doc = this.documentRepo.create({
      user,
      originalName,
      filename,
      status: "pending",
      uploadedAt: new Date(),
    });
    return await this.documentRepo.save(doc);
  }

  async getStudentDocuments(userId: number): Promise<Document[]> {
    return await this.documentRepo.find({
      where: { user: { id: userId } },
      order: { uploadedAt: "DESC" }
    });
  }

  async reviewDocument(docId: number, status: "approved" | "rejected", reviewNote?: string): Promise<Document> {
    const doc = await this.documentRepo.findOne({ where: { id: docId } });
    if (!doc) throw new Error("Document not found");
    doc.status = status;
    doc.reviewNote = reviewNote;
    return await this.documentRepo.save(doc);
  }

  async getDocumentById(docId: number): Promise<Document | null> {
    return await this.documentRepo.findOne({ where: { id: docId }, relations: ["user"] });
  }

  async deleteDocument(docId: number, userId: number): Promise<boolean> {
    const doc = await this.documentRepo.findOne({ where: { id: docId }, relations: ["user"] });
    if (!doc) throw new Error("Document not found");
    if (doc.status !== "pending") throw new Error("Only pending documents can be deleted");
    if (doc.user.id !== userId) throw new Error("Forbidden");
    // Fájl törlése
    const filePath = path.join(this.uploadDir, doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await this.documentRepo.remove(doc);
    return true;
  }

  async streamDocument(doc: Document): Promise<fs.ReadStream> {
    const filePath = path.join(this.uploadDir, doc.filename);
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    return fs.createReadStream(filePath);
  }
}
