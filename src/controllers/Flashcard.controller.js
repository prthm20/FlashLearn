import axios from "axios";
import { Note } from "../models/Notes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OpenAI from "openai";
import { ApiResponse } from "../utils/ApiResponse.js";
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY});

const flashcards=asyncHandler( async (req,res) => {
    const { summary } = req.query;
    const note = summary;
    console.log(summary)
  
    const completion = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
            { role: "system", content: "You are a Notes maker create flash cards" },
            {
                role: "user",
                content:`Create flashcards from this text: ${summary}`,
            },
        ],
    });
     
    console.log(completion.choices)
    const flash = completion.choices
    console.log(flash)
   // note.flashcards=flash
   // await note.save();
   return res.status(201).json(
    new ApiResponse(200,"notes created succesfully",flash)
) ;
}
)



export {flashcards}