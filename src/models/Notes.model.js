import mongoose,{Schema} from "mongoose";

const NoteSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: {type:String},
    originalText: {type:String},
    summary: {type:String},
    flashcards: [{ question: String, answer: String }],
    vectorEmbedding: { type: Array }, // For AI Q&A
    createdAt: { type: Date, default: Date.now }
  });
  
  export const Note = mongoose.model("Note", NoteSchema);