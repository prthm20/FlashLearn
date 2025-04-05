import axios from "axios";
import { Note } from "../models/Notes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: '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' });

const flashcards=asyncHandler( async (req,res) => {
    const { noteId } = req.body;
    const note = await Note.findById(noteId);
  
    const completion = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
            { role: "system", content: "You are a Notes maker create flash cards" },
            {
                role: "user",
                content:`Create flashcards from this text: ${note.summary}`,
            },
        ],
    });
     
    console.log(completion.choices)
    const flash = completion.choices.message
    note.flashcards=flash
    await note.save();
    return completion.choices[0].message.content;
}
)



export {flashcards}