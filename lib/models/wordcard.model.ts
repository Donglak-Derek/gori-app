import mongoose, { Schema } from "mongoose";

const WordcardSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cardNumber: { type: Number, required: true },
  kind: { type: String, required: true },
  smallTitle: { type: String, required: true },
  korean: { type: String, required: true },
  english: { type: String, required: true },
});
const Wordcard =
  mongoose.models.Wordcard || mongoose.model("Wordcard", WordcardSchema);

export default Wordcard;
