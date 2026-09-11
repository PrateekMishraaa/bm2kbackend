import Issue, { ISSUE_PRIORITIES, ISSUE_STATUSES } from "../models/Issue.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllIssues = asyncHandler(async (req, res) => {
  const { store, category, priority, status, search } = req.query;
  const query = {};
  if (store) query.storeNumber = store;
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (status) query.status = status;

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [
      { id: regex },
      { storeNumber: regex },
      { category: regex },
      { description: regex },
      { assignedManager: regex },
    ];
  }

  const issues = await Issue.find(query).sort({ dateReported: -1, id: 1 });
  res.json({ count: issues.length, data: issues });
});

export const getSummary = asyncHandler(async (_req, res) => {
  const [open, high, resolved, followUp] = await Promise.all([
    Issue.countDocuments({ status: { $ne: "Resolved" } }),
    Issue.countDocuments({ priority: { $in: ["High", "Urgent"] } }),
    Issue.countDocuments({ status: "Resolved" }),
    Issue.countDocuments({ priority: { $in: ["High", "Urgent"] }, status: { $ne: "Resolved" } }),
  ]);
  res.json({ open, high, resolved, followUp });
});

export const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findOne({ id: req.params.id });
  if (!issue) throw new ApiError(404, `Issue ${req.params.id} not found`);
  res.json({ data: issue });
});

export const createIssue = asyncHandler(async (req, res) => {
  const { id, storeNumber, category, description, dateReported, priority, status, assignedManager, managementNote } = req.body;
  if (!id || !storeNumber || !category || !description || !dateReported || !priority || !assignedManager) {
    throw new ApiError(400, "Missing required fields");
  }
  if (!ISSUE_PRIORITIES.includes(priority)) throw new ApiError(400, `Priority must be one of: ${ISSUE_PRIORITIES.join(", ")}`);
  if (status && !ISSUE_STATUSES.includes(status)) throw new ApiError(400, `Status must be one of: ${ISSUE_STATUSES.join(", ")}`);

  const exists = await Issue.findOne({ id });
  if (exists) throw new ApiError(409, `Issue ${id} already exists`);

  const issue = await Issue.create({
    id, storeNumber, category, description, dateReported, priority,
    status: status || "New", assignedManager, managementNote: managementNote || "",
  });
  res.status(201).json({ data: issue });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new ApiError(400, "Status is required");
  if (!ISSUE_STATUSES.includes(status)) throw new ApiError(400, `Status must be one of: ${ISSUE_STATUSES.join(", ")}`);

  const issue = await Issue.findOneAndUpdate(
    { id: req.params.id },
    { status },
    { new: true, runValidators: true }
  );
  if (!issue) throw new ApiError(404, `Issue ${req.params.id} not found`);
  res.json({ data: issue });
});

export const updateNote = asyncHandler(async (req, res) => {
  const { note } = req.body;
  if (typeof note !== "string") throw new ApiError(400, "Note must be a string");

  const issue = await Issue.findOneAndUpdate(
    { id: req.params.id },
    { managementNote: note.trim() },
    { new: true, runValidators: true }
  );
  if (!issue) throw new ApiError(404, `Issue ${req.params.id} not found`);
  res.json({ data: issue });
});

export const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findOneAndDelete({ id: req.params.id });
  if (!issue) throw new ApiError(404, `Issue ${req.params.id} not found`);
  res.json({ message: `Issue ${req.params.id} deleted` });
});
