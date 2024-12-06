import { getPostsById } from '../../frontend/src/service/postService.js';
import Post from '../models/postModel.js';

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newPost = await Post.create({
            title,
            content,
        });

        return res.status(200).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        return res.status(500).send('Error creating post');
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();

        return res.status(200).json(posts);
    } catch (err) {
        console.error("Error creating post:", err);
        return res.status(500).send('Error creating post');
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePost = async (req, res) => {
    const { id } = await req.params;
    const { title, content } = await req.body;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        return res.status(200).json(post);
    } catch (err) {
        console.error("Error updating post:", err);
        return res.status(500).json({ message: 'Error updating post' });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.destroy();
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ message: 'Error deleting post' });
    }
};

export { createPost, getAllPosts, updatePost, deletePost, getPostById };
