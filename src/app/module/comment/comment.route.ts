import express from "express";
import { auth } from "../../middleware/auth.js";
import commentController from "./comment.controller.js";

const router = express.Router();

router.post("/", auth(), commentController.createComment);

const commentRouter = router;
export default commentRouter;