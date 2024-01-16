import { Router } from "express";
import * as questionController from "../controllers/questionController.js";

const questionRouter = Router();

// กำหนด route ผู้ใช้งานสามารถสร้างคำถามได้
questionRouter.post("/", questionController.addQuestion);

// route ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
questionRouter.get("/", questionController.getAllQuestions);

// route ผู้ใช้งานสามารถที่จะดูคำถามแต่ละอันได้ ด้วย Id ของคำถามได้
questionRouter.get("/:id", questionController.getQuestionById);

//  route ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
questionRouter.put("/:id", questionController.updateQuestion);

//  route ผู้ใช้งานสามารถที่จะลบคำถามได้
questionRouter.delete("/:id", questionController.deleteQuestion);

// route ผู้ใช้งานสามารถที่จะค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
questionRouter.get("/search/:query", questionController.searchQuestions);

//  route ผู้ใช้งานสามารถสร้างคำตอบของคำถามนั้นได้
questionRouter.post("/:id/answers", questionController.addAnswer);

//  route ผู้ใช้งานสามารถที่จะดูคำตอบของคำถามแต่ละอันได้
questionRouter.get("/:id/answers", questionController.getAnswersByQuestionId);

//  route ผู้ใช้งานสามารถที่จะลบคำถามและคำตอบได้
questionRouter.delete("/:id", questionController.deleteQuestionAndAnswers);

export default questionRouter;
