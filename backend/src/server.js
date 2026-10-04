import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// instead of using these two lines, we should use the router from authRoutes.js
// app.use("/", RegisterUser);
// app.use("/signin", SignInUser);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`)
})