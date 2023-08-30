import mongoose, { Schema } from "mongoose";

const WordCardSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: { type: String },
  cardNumber: { type: Number, required: true },
  kind: { type: String, required: true },
  smallTitle: { type: String, required: true },
  korean: { type: String, required: true },
  english: { type: String, required: true },
  savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
const WordCard =
  mongoose.models.WordCard || mongoose.model("WordCard", WordCardSchema);

export default WordCard;
