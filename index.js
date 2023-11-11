const express = require("express");
const mongoose = require("mongoose");
const color = require('cli-color');
const BlogPost = require("./schemas/blogSchema");
require('dotenv').config()

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(`mongodb+srv://sumankisku:${process.env.PASSWORD}@cluster0.7nxa6go.mongodb.net/blog-api`).then(() => {
    console.log(color.green.bold("Connected to MongoDB"));
}).catch((err) => {
    console.error("Could not connect to MongoDB;", err)
})

// Create a new blog post
app.post("/api/blog", async (req, res) => {
    let blogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
    })

    blogPost = await blogPost.save();

    return res.send(blogPost);
})

// Read all blog posts
app.get("/api/blog", async (req, res) => {
    let blogposts = await BlogPost.find();

    return res.status(200).json({
        "message": "Successful",
        "data": blogposts,
    });
})

// Update a blog post
app.put("/api/blog/:id", async (req, res) => {
    const id = req.params.id;

    const { title, content } = req.body;

    let updatedPost = await BlogPost.findByIdAndUpdate(id, {
        title,
        content
    },
        {
            new: true // Sent the updated data, not the old data
        }
    )

    return res.status(200).json({
        "message": "Post updated successfully",
        "data": updatedPost,
    });
})

// Delete a blog post
app.delete("/api/blog/:id", async (req, res) => {
    const id = req.params.id;

    let deletedPost = await BlogPost.findByIdAndDelete(id);

    return res.status(202).json({
        "message": "Post deleted successfully",
        "data": deletedPost,
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(color.green.bold(`Listening on port ${port}`));
})