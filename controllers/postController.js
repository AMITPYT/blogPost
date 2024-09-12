
const Post = require('../models/post');
const User = require('../models/auth');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const { userId } = req;
  
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
  
    try {
      const post = new Post({ title, content, author: userId });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error); 
      res.status(500).json({ error: 'Error creating post' });
    }
  };
  
// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

// Like/Unlike a post
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error liking/unliking post' });
  }
};

// Get posts by author
exports.getPostsByAuthor = async (req, res) => {
  const { authorId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Post.find({ author: authorId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts by author' });
  }
};

// Get posts by popularity
exports.getPostsByPopularity = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ 'likes.length': -1 })
      .populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts by popularity' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ userId, comment });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
};
