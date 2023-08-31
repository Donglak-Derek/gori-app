import mongoose, { Schema } from "mongoose";

/** classe can have many cards */
const ClasseSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  classeStyle: { type: String, required: true },
  classeTitle: { type: String, required: true },
  wordcards: [{ type: Schema.Types.ObjectId, ref: "WordCard" }],
  completedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Classe = mongoose.models.Classe || mongoose.model("Classe", ClasseSchema);

export default Classe;
