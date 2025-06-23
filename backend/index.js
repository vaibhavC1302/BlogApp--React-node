import express from "express";
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import connectDB from "./lib/connectDB.js";
import webhookRouter from "./routes/webhook.route.js"
import { clerkMiddleware, getAuth, requireAuth } from '@clerk/express'
import cors from "cors"

const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors(process.env.CLIENT_URL))
app.use(clerkMiddleware())
app.use("/webhook", webhookRouter)
// using express.json after webhook route cuz using body parser in webhook route
app.use(express.json())

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// test api
app.get("/auth-state", (req, res) => {
    console.log("/test1 hit")
    console.log("headers:::", req.headers)
    const authState = getAuth(req)
    console.log("user id", authState.sessionClaims.metadata.role)
    res.send(authState);
})


// error handling
app.use((error, req, res, next) => {
    console.log("error occured")
    res.status(error.status || 500)
    res.json({
        message: error.message,
        status: error.status,
        stack: error.stack
    })
})

app.listen(8000, () => {
    console.log("listening to port 8000");
    connectDB();
})