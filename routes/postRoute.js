// routes/postRoutes.js
const express = require('express');
const { createPost, getAllPosts, updatePost, deletePost, likePost, getPostsByAuthor, getPostsByPopularity, addComment } = require('../controllers/postController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Create post
router.post('/create', authenticateToken, createPost);

// Get all posts with pagination
router.get('/', getAllPosts);

// Update post
router.put('/:postId', authenticateToken, updatePost);

// Delete post
router.delete('/:postId', authenticateToken, deletePost);

// Like/Unlike post
router.post('/:postId/like', authenticateToken, likePost);

// Get posts by author
router.get('/author/:authorId', getPostsByAuthor);

// Get posts by popularity
router.get('/popularity', getPostsByPopularity);

// Add a comment to a post
router.post('/:postId/comment', authenticateToken, addComment);

module.exports = router;
