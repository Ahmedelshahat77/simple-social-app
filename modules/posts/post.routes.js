import { Router } from "express";
import { auth } from "../../middlewares/authentication.js";
const router = Router();

import * as postController from "./post.controller.js";

router.post("/", auth(), postController.addPost);
router.post("/like", auth(), postController.likePost);
router.post("/unlike", auth(), postController.unlikePost);
router.delete("/", auth(), postController.deletepost);
router.put("/", auth(), postController.upadtePost);
router.get("/", auth(), postController.getUserPosts);
router.get("/all", auth(), postController.getAllPosts);
export default router;
