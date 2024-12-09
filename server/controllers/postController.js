import Post from "../models/postModel.js";

const createPost = async(req,res) => {
    try{
        const {title, content} = req.body;

        const newPost = await Post.create({
            title,
            content,
        })
        return res.status(200).json(newPost);
    }catch(err){
        console.error("Error creating post: ", err);
        return res.status(500).send("Error creating post");
    }
}

const getAllPosts = async(req, res) => {
    try{
        const posts = Post.findAll();

        return res.status(200).json(posts)
    } catch(err){
        console.error("Error creating post:", err);
        return res.status(500).send('Error creating post');
    }
}

export{createPost, getAllPosts};