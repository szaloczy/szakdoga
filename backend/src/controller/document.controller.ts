import { Request, Response } from "express";
import { DocumentService } from "../service/document.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { UserRole } from "../types";
import * as path from "path";
import * as fs from "fs";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME = ["application/pdf"];

export class DocumentController {
  private service = new DocumentService();

  upload = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      if (!ALLOWED_MIME.includes(req.file.mimetype)) return res.status(400).json({ error: "Only PDF allowed" });
      if (req.file.size > MAX_SIZE) return res.status(413).json({ error: "File too large" });
      const doc = await this.service.saveDocument(user.id, req.file.originalname, req.file.filename);
      res.json({ success: true, document: doc });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const docs = await this.service.getAllDocuments();
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getStudentDocuments = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
      const docs = await this.service.getStudentDocuments(user.id);
      res.json(docs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  review = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user?.id || user.role !== UserRole.ADMIN) return res.status(403).json({ error: "Forbidden" });
      const docId = Number(req.params["id"]);
      const { status, reviewNote } = req.body;
      if (!docId || !["approved", "rejected"].includes(status)) return res.status(400).json({ error: "Invalid request" });
      const doc = await this.service.reviewDocument(docId, status, reviewNote);
      res.json({ success: true, document: doc });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  download = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const docId = Number(req.params["id"]);
      const doc = await this.service.getDocumentById(docId);
      if (!doc) return res.status(404).json({ error: "Document not found" });
      if (doc.user.id !== user.id && user.role !== UserRole.ADMIN) return res.status(403).json({ error: "Forbidden" });
      const filePath = path.resolve(__dirname, "../../uploads", doc.filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"${doc.originalName}\"`);
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const docId = Number(req.params["id"]);
      const success = await this.service.deleteDocument(docId, user.id);
      res.json({ success });
    } catch (err) {
      if (err.message === "Only pending documents can be deleted") return res.status(400).json({ error: err.message });
      if (err.message === "Forbidden") return res.status(403).json({ error: err.message });
      res.status(500).json({ error: err.message });
    }
  };
}
