import express from "express";
import cors from "cors";
import questionRouter from "./routers/questionRouter.js";
import { client } from "./utils/db.js";

async function init() {
  // Connect MongoDB
  await client.connect();

  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // questionRouter สำหรับ route
  app.use("/questions", questionRouter);

  // HomePage
  app.get("/", (req, res) => {
    return res.json("Hello Skill Checkpoint #2");
  });

  // Not Found
  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  // Port Connection !
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
init();
