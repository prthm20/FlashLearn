import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";


dotenv.config();
console.log(process.env.MONGODB_URL)

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Sever is running at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!",err);
})