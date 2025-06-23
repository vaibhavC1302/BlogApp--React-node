import postModel from "../models/post.model.js";

const increaseVisit = async (req, res, next) => {
    console.log("increase middleware")
    const slug = req.params.slug;

    await postModel.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });
    next();
}

export default increaseVisit; 