import { Router } from "express";
import { auth } from "../../middlewares/authentication.js";
const router = Router();

import * as commentController from "./comment.controller.js";

router.post("/", auth(), commentController.addComment);
router.post("/", auth(), commentController.updateComment);
router.delete("/", auth(), commentController.deleteComment);

export default router;
