import express from "express";
import connectDb from "./database/connect.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => {
  res.send("heelo from express!");
});

app.use(express.json()); // needed before routes so teh req.body actually parses

app.use(cors());
app.use("/api/auth", authRoutes); // setting up the auth routes

app.use("/api/habits", habitRoutes); // setting up all the habit routes

// here we are doing both things in server.js where the server and the mongo connection both are connecting.

async function startServer() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`The server is listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log("MongoDb connection Failed: ", error.message);
    process.exit(1); // this command immediately stops the nodejs program, no matter what is about to run or running at the moment

    // process.exit(0) means that the program has ended successfully
    // process.exit(1) means that the program has ran into something or that something went wrong
  }
}

startServer();
