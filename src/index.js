import connectDB from "./db/index.js";
import dotenv from "dotenv"
import path from "path";


dotenv.config();
console.log(process.env.MONGODB_URL)

connectDB();