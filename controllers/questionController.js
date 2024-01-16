import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

// กำหนดตัวแปร collection ที่จะใช้เก็บ collection ของคำถาม
const collection = db.collection("questions");

// เพิ่มคำถามลงใน Database
export const addQuestion = async (req, res) => {
  try {
    // นำข้อมูลจาก request body มาเพิ่มใน collection พร้อมกับเพิ่ม timestamp created_at
    const questionData = { ...req.body, created_at: new Date() };
    await collection.insertOne(questionData);
    return res.json({
      message: "Question has been added successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// ดึงคำถามทั้งหมด จาก Database
export const getAllQuestions = async (req, res) => {
  try {
    // ค้นหาทั้งหมดและแปลงเป็น array สำหรับการแสดงผล
    const allQuestions = await collection.find().toArray();
    return res.json({ data: allQuestions });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// ดึงคำถาม ตาม id จาก Database
export const getQuestionById = async (req, res) => {
  try {
    // แปลง string id เป็น ObjectId ใช้ค้นหา
    const questionId = new ObjectId(req.params.id);
    const questionData = await collection.findOne(questionId);
    return res.json({ data: questionData });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// อัพเดทคำถาม ตาม id ใน Database
export const updateQuestion = async (req, res) => {
  try {
    // นำข้อมูลใหม่มาเพิ่มพร้อมกับ timestamp modified_at
    const newQuestionData = { ...req.body, modified_at: new Date() };
    const questionId = new ObjectId(req.params.id);
    await collection.updateOne({ _id: questionId }, { $set: newQuestionData });
    return res.json({
      message: "Question has been updated successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// ลบคำถาม ตาม id จาก Database
export const deleteQuestion = async (req, res) => {
  try {
    // แปลง string id เป็น ObjectId และลบข้อมูล
    const questionId = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: questionId });
    return res.json({
      message: "Question has been deleted successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// ค้นหาคำถามตามหัวข้อหรือหมวดหมู่
export const searchQuestions = async (req, res) => {
  try {
    const { query } = req.params;
    const regex = new RegExp(query, "i");
    const matchedQuestions = await collection
      .find({ $or: [{ title: regex }, { category: regex }] })
      .toArray();
    return res.json({ data: matchedQuestions });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// สร้างคำตอบให้กับคำถาม
export const addAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const truncatedAnswer = answer.substring(0, 300);

    const answerData = {
      text: truncatedAnswer,
      created_at: new Date(),
    };

    const questionId = new ObjectId(req.params.id);
    // เพิ่มคำตอบลงในคำถาม ที่ตรงกับ id
    await collection.updateOne(
      { _id: questionId },
      { $push: { answers: answerData } }
    );
    return res.json({
      message: "Answer has been added successfully",
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// ดูคำตอบของคำถาม
export const getAnswersByQuestionId = async (req, res) => {
  try {
    const questionId = new ObjectId(req.params.id);

    // ค้นหาคำถามและเลือกเฉพาะคำตอบในผลลัพธ์
    const questionData = await collection.findOne(questionId, {
      projection: { _id: 0, answers: 1 },
    });
    return res.json({ data: questionData?.answers || [] });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};

// ลบคำถามและคำตอบทั้งหมดของคำถามนั้นๆ
export const deleteQuestionAndAnswers = async (req, res) => {
  try {
    const questionId = new ObjectId(req.params.id);

    // ลบคำถามและเลือกเฉพาะคำตอบในผลลัพธ์
    const deletedData = await collection.findOneAndDelete({ _id: questionId });

    return res.json({
      message: "Question and its answers have been deleted successfully",
      deletedData,
    });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
};
