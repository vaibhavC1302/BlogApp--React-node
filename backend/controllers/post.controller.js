import { getAuth } from "@clerk/express";
import postModel from "../models/post.model.js"
import userModel from "../models/user.model.js";
import ImageKit from "imagekit";

// get all posts
export const getPosts = async (req, res) => {
    console.log("inside get post request")
    console.log("REQUEST QUERIES :::", req.query)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const query = {};

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if (cat) {
        query.category = cat
    }
    if (searchQuery) {
        query.title = { $regex: searchQuery, $options: "i" };
    }
    if (author) {
        const user = await userModel.findOne({ username: author }).select("_id")
        if (!user) {
            return res.status(404).json("No posts found")
        }
        query.user = user._id
    }

    let sortObj = { createdAt: -1 }
    if (sortQuery) {
        switch (sortQuery) {
            case "newest":
                sortObj = { createdAt: -1 }
                break
            case "oldest":
                sortObj = { createdAt: 1 }
                break
            case "popular":
                sortObj = { visit: -1 }
                break
            case "trending":
                sortObj = { visit: -1 }
                query.createdAt = {
                    $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
                break

        }
    }


    if (featured) {
        query.isFeatured = true;
    }


    const posts = await postModel.find(query)
        .populate("user", "username")
        .sort(sortObj)
        .limit(limit)
        .skip((page - 1) * limit);

    const totalPosts = await postModel.countDocuments();
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });

}

// get a single post 
export const getPost = async (req, res) => {
    console.log("inside getPost")
    const post = await postModel.findOne({ slug: req.params.slug }).populate("user", "username img");
    res.status(200).send(post);

}

// create a new post 
export const createPost = async (req, res) => {
    console.log("creating post")
    const clerkUserId = getAuth(req).userId;
    console.log("clerkuserId", clerkUserId)
    if (!clerkUserId) {
        console.log("not user id")
        return res.status(401).json("Not authenticated!")
    }

    const user = await userModel.findOne({ clerkUserId })
    if (!user) {
        return res.status(404).json("user not found!")
    }

    // creating a slug
    const { title } = req.body;
    const initials = title.split(/\s+/).map(word => word[0]).join('').toLowerCase();
    const randomStr = Math.random().toString(36).substring(2, 12);
    const slug = `${initials}-${randomStr}`;
    console.log("slug generated ::", slug)


    const newPost = new postModel({ user: user._id, slug, ...req.body })
    console.log("new post to be saved :", newPost);
    const post = await newPost.save()
    res.status(200).send(post)

}

// deleting a post....
export const deletePost = async (req, res) => {
    console.log("deleting post");
    const clerkUserId = getAuth(req).userId;
    console.log(clerkUserId)
    if (!clerkUserId) {
        console.log("not clerk userid")
        return res.status(401).json("Not authenticated!");
    }

    const role = getAuth(req).sessionClaims?.metadata?.role || "user";
    console.log("user Role: ", role)
    if (role === "admin") {
        await postModel.findByIdAndDelete(req.params.id)
        console.log("post deleted by admin")
        return res.status(200).json("post has been deleted by admin")
    }

    const user = await userModel.findOne({ clerkUserId });
    console.log("user::", user)
    const post = await postModel.findOneAndDelete({
        _id: req.params.id,
        user: user._id
    })
    if (!post) {
        console.log("post with giver user and id doesnot exist")
        return res.status(403).json("You can delete only your post")
    }
    console.log("deleted post : ", post)
    res.status(200).json("Post has been deleted")
}

// upload auth

const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY
});

export const uploadAuth = (req, res) => {
    const { token, expire, signature } = imagekit.getAuthenticationParameters();
    res.send({ token, expire, signature, publicKey: process.env.IK_PUBLIC_KEY });

}

// feature a post (by admin)
export const featurePost = async (req, res) => {
    const clerkUserId = getAuth(req).userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
        console.log("not clerk userid")
        return res.status(401).json("Not authenticated!");
    }

    const role = getAuth(req).sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
        return res.status(403).json("You dont not have admin rights")
    }

    const post = await postModel.findById(postId);
    if (!post) {
        return res.status(404).json("post not found");
    }

    const isFeatured = post.isFeatured;

    const updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { isFeatured: !isFeatured },
        { new: true }
    );
    console.log("is featured changed successfully!!")
    res.status(200).json(updatedPost)

}