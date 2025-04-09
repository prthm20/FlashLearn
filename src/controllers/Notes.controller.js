import axios from "axios";
import { Note } from "../models/Notes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OpenAI from "openai";
import { ApiResponse } from "../utils/ApiResponse.js";
const openai = new OpenAI({ apiKey:process.env.OPEN_AI_KEY});

const Notes=asyncHandler( async (req,res) => {
  const {text} = req.query
  console.log(req.query)
  console.log(text)
    const completion = await openai.chat.completions.create({
        model: "gpt-4o", 
        messages: [
            { role: "system", content: "You are a Notes maker that summarizes study material" },
            {
                role: "user",
                content:`summarize ${text}`,
            },
        ],
    });
     
    console.log("Result:",completion.choices[0].message.content)
    const summary = completion.choices[0].message.content;
    //const note = new Note({ userId, originalText: text, summary });
    //await note.save();
     return res.status(201).json(
        new ApiResponse(200,"notes created succesfully",summary)
    ) ;
}
)

export {Notes}