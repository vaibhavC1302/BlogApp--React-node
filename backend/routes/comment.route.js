import express from "express"
import { getPostComment, deleteComment, addComment } from "../controllers/comment.controller.js"
const router = express.Router()

router.get("/:postId", getPostComment)
router.post("/:postId", addComment)
router.delete("/:id", deleteComment)

export default router;