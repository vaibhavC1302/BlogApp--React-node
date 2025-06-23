import { getAuth } from "@clerk/express"
import userModel from "../models/user.model.js";

export const getUserSavedPost = async (req, res) => {
    console.log("getssaved posts hit")
    const clerkUserId = getAuth(req).userId;
    console.log(clerkUserId)
    if (!clerkUserId) {
        console.log("no clerk userid")
        return res.status(403).json("not authenticated!")
    }

    const user = await userModel.findOne({ clerkUserId })
    if (!user) {
        console.log("found clerk id but not user")
    }
    res.status(200).json(user.savedPosts)
}

export const savePost = async (req, res) => {
    const clerkUserId = getAuth(req).userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
        return res.status(403).json("user not authenticated")
    }

    const user = await userModel.findOne({ clerkUserId })

    const isSaved = user.savedPosts.some((p) => p === postId);

    if (!isSaved) {
        await userModel.findByIdAndUpdate(user._id, {
            $push: { savedPosts: postId }
        })
    } else {
        await userModel.findOneAndUpdate(user._id, {
            $pull: { savedPosts: postId }
        })
    }

    res.status(200).json(isSaved ? "post unsaved" : "post saved")

}