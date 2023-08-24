import mongoose, { Schema } from "mongoose";

/** Lesson can have many classes */
const LessonSchema = new Schema({
  _id: Schema.Types.ObjectId,
  lessonNumber: { type: Number, required: true },
  lessonTitle: { type: String, required: true },
  classes: [{ type: Schema.Types.ObjectId, ref: "Classe" }],
  completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);

export default Lesson;
