import mongoose, { Schema } from "mongoose";

/** Course can have many lessons */
const CourseSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;
