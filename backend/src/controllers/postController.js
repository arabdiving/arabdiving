const Post = require("../models/Post");


const likePost = async (req, res) => {
  try {
    const post = await Post.findById(
      req.params.id
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked =
      post.likes.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message:
          "You already liked this post",
      });
    }

    post.likes.push(req.user._id);

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      content: req.body.content,
    });


    res.status(201).json({
      success: true,
      post,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (
      post.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createPost,
  getPosts,
  getPostsByUser,
  likePost,
  deletePost,
};