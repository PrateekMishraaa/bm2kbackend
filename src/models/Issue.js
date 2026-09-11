import mongoose from "mongoose";

export const ISSUE_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export const ISSUE_STATUSES = ["New", "In Progress", "Resolved"];

const issueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, index: true },
    storeNumber: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    dateReported: { type: String, required: true },
    priority: { type: String, required: true, enum: ISSUE_PRIORITIES },
    status: { type: String, required: true, enum: ISSUE_STATUSES, default: "New" },
    assignedManager: { type: String, required: true, trim: true },
    managementNote: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

export default mongoose.model("Issue", issueSchema);
