import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"16kb"
}))
app.use(urlencoded())
app.use(express.static("public"))
app.use(cookieParser())


//routes import 

import userrouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",userrouter)

"http://localhost:8000/api/v1/user/route"
export default app; 