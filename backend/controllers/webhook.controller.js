import { Webhook } from "svix";
import userModel from "../models/user.model.js"
import postModel from "../models/post.model.js"
import commentModel from "../models/comment.model.js"


export const clerkWebhook = async (req, res) => {
    console.log("webhook hit")
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
        throw new Error("webhook secret needed!")
    }

    const payload = req.body;
    const headers = req.headers;

    console.log("new webhook")
    const wh = new Webhook(secret);
    let evt;
    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        res.status(400).json({
            message: "webhook verification failed!"
        });
    }
    if (evt.type === "user.created") {
        const newUser = new userModel({
            clerkUserId: evt.data.id,
            username: evt.data.username || evt.data.email_addresses[0].email_address,
            email: evt.data.email_addresses[0].email_address,
            img: evt.data.profile_img_url
        })

        await newUser.save();
    }

    /* if event is user deleted */
    // if (evt.type === "user.deleted") {
    //     const deletedUser = await userModel.findOneAndDelete({
    //         clerkUserId: evt.data.id,
    //     });

    //     await postModel.deleteMany({ user: deletedUser._id })
    //     await commentModel.deleteMany({ user: deletedUser._id })
    // }

    //if event is user updated

    console.log("webhook success")
    return res.status(200).json({
        message: "webhook recieved",
    })


}