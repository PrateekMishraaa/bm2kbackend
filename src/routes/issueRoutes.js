import { Router } from "express";
import {
  getAllIssues,
  getSummary,
  getIssueById,
  createIssue,
  updateStatus,
  updateNote,
  deleteIssue,
} from "../controllers/issueController.js";

const router = Router();

router.get("/summary", getSummary);
router.get("/", getAllIssues);
router.post("/", createIssue);
router.get("/:id", getIssueById);
router.patch("/:id/status", updateStatus);
router.patch("/:id/note", updateNote);
router.delete("/:id", deleteIssue);

export default router;
