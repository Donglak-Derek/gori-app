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

// const UserProgressSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   user: { type: Schema.Types.ObjectId, ref: "User" },
//   course: { type: Schema.Types.ObjectId, ref: "Course" },
//   lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
//   classe: { type: Schema.Types.ObjectId, ref: "Classe" },
//   wordCard: { type: Schema.Types.ObjectId, ref: "Wordcard" },
//   score: { type: Number, required: true },
//   completed: { type: Boolean, required: true, default: false },
// });

// const LeaderboardSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   user: { type: Schema.Types.ObjectId, ref: "User" },
//   course: { type: Schema.Types.ObjectId, ref: "Course" },
//   totalScore: { type: Number, required: true },
//   // Other leaderboard-related fields can go here
// });

// const CommentSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   user: { type: Schema.Types.ObjectId, ref: "User" },
//   wordCard: { type: Schema.Types.ObjectId, ref: "Wordcard" },
//   content: { type: String, required: true },
//   date: { type: Date, default: Date.now },
//   likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
// });

// Create the models

// const UserProgress = mongoose.model("UserProgress", UserProgressSchema);
// const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
// const Comment = mongoose.model("Comment", CommentSchema);

// todo: change description for course
