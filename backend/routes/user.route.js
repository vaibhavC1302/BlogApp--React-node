import express from "express"
import { getUserSavedPost, savePost } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/saved", getUserSavedPost)
router.patch("/save", savePost)


export default router