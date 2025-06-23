import { clerkClient, getAuth } from "@clerk/express";
import commentModel from "../models/comment.model.js"
import userModel from "../models/user.model.js";

// getting all the comments
export const getPostComment = async (req, res) => {
    console.log("get Comments hit")
    const comments = await commentModel.find({ post: req.params.postId }).populate("user", "username img").sort({ createdAt: -1 })

    res.json(comments);
}


// adding a comment 
export const addComment = async (req, res) => {
    console.log("adding new comment ")

    const clerkUserId = getAuth(req).userId;
    const postId = req.params.postId;

    console.log("userId and postId", clerkUserId, postId)
    if (!clerkUserId) {
        return res.status(401).json("User not authenticated!")
    }
    const user = await userModel.findOne({ clerkUserId });

    const newComment = new commentModel({
        ...req.body,
        user: user._id,
        post: postId
    })

    const savedComment = await newComment.save();
    console.log("new comment saved :::", savedComment);

    res.status(201).json(savedComment);

}

// deleting a comment 
export const deleteComment = async (req, res) => {
    const clerkUserId = getAuth(req).userId;
    const id = req.params.id;
    console.log("clerkUserId, commentId:::", clerkUserId, id)
    if (!clerkUserId) {
        return res.status(401).json("User not authenticated!")
    }

    const role = getAuth(req).sessionClaims?.metadata?.role || "user";
    console.log("user Role: ", role)
    if (role === "admin") {
        await commentModel.findByIdAndDelete(req.params.id)
        console.log("comment deleted by admin")
        return res.status(200).json("comment has been deleted by admin")
    }

    const user = await userModel.findOne({ clerkUserId })

    const deletedComment = await commentModel.findOneAndDelete({
        _id: id,
        user: user._id
    })

    if (!deletedComment) {
        res.status(403).json("not your comment to be deleted");
    }

    res.status(201).json("comment deleted")

}