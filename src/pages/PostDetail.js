// src/pages/PostDetail.js

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetPostBySlugQuery, useAddCommentMutation, useDeletePostMutation } from '../services/blogApi';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';
import { handleApiError } from '../utils/handleApiError';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [commentContent, setCommentContent] = useState('');
  const [isCommentError, setIsCommentError] = useState(false);
  
  // Fetch post details
  const { data: post, error, isLoading } = useGetPostBySlugQuery(slug);
  
  // Mutations
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
  
  // Check if logged in user is the author
  const isAuthor = user && post?.author?.id === user.id;
  
  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate comment
    if (!commentContent.trim()) {
      setIsCommentError(true);
      return;
    }
    
    try {
      await addComment({
        slug,
        content: commentContent,
      }).unwrap();
      
      // Reset form
      setCommentContent('');
      setIsCommentError(false);
      
      toast.success('Comment added successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Handle post deletion
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(slug).unwrap();
        toast.success('Post deleted successfully');
        navigate('/');
      } catch (error) {
        handleApiError(error);
      }
    }
  };
  
  // Content to render based on loading/error states
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader type="post-detail" />;
    }
    
    if (error) {
      return (
        <div className="error-message">
          <h2>Error loading post</h2>
          <p>The post you're looking for could not be found or there was an error loading it.</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      );
    }
    
    if (!post) {
      return (
        <div className="error-message">
          <h2>Post not found</h2>
          <p>The post you're looking for could not be found.</p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      );
    }
    
    // Create avatar for author
    const avatarUrl = `https://ui-avatars.com/api/?name=${post.author.first_name}+${post.author.last_name}&background=random`;
    
    return (
      <>
        <div className="post-detail">
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta">
              <div className="post-author">
                <div className="author-avatar">
                  <img src={avatarUrl} alt={`${post.author.first_name} ${post.author.last_name}`} />
                </div>
                <div>
                  <div className="author-name">{post.author.first_name} {post.author.last_name}</div>
                  <div className="post-date">{formatDate(post.created_at)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {post.featured_image && (
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="post-featured-image" 
            />
          )}
          
          <div className="post-content">
            {/* Render content */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {isAuthor && (
            <div className="post-actions">
              <Link to={`/edit/${post.slug}`}>
                <Button variant="secondary">Edit Post</Button>
              </Link>
              
              <Button 
                variant="danger" 
                onClick={handleDeletePost} 
                disabled={isDeletingPost}
              >
                {isDeletingPost ? 'Deleting...' : 'Delete Post'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="comments-section">
          <div className="comments-header">
            <h3>Comments ({post.comments?.length || 0})</h3>
          </div>
          
          {isAuthenticated ? (
            <div className="comment-form">
              <form onSubmit={handleCommentSubmit}>
                <div className="form-group">
                  <label htmlFor="comment">Add a comment</label>
                  <textarea
                    id="comment"
                    rows="4"
                    value={commentContent}
                    onChange={(e) => {
                      setCommentContent(e.target.value);
                      if (isCommentError) setIsCommentError(false);
                    }}
                    disabled={isAddingComment}
                  ></textarea>
                  {isCommentError && (
                    <div className="error-message">Please enter a comment</div>
                  )}
                </div>
                
                <div className="form-actions">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isAddingComment}
                  >
                    {isAddingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="comment-login-prompt">
              <p>Please <Link to="/login">login</Link> to leave a comment.</p>
            </div>
          )}
          
          <div className="comments-list">
            {post.comments?.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <div className="comment-author">
                      <div className="author-avatar">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${comment.author.first_name}+${comment.author.last_name}&background=random`}
                          alt={`${comment.author.first_name} ${comment.author.last_name}`} 
                        />
                      </div>
                      <div className="author-name">
                        {comment.author.first_name} {comment.author.last_name}
                      </div>
                    </div>
                    <div className="comment-date">{formatDate(comment.created_at)}</div>
                  </div>
                  
                  <div className="comment-content">
                    <p>{comment.content}</p>
                  </div>
                  
                  {(user?.id === comment.author.id || isAuthor) && (
                    <div className="comment-actions">
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => {
                          // Delete comment functionality (would need to implement)
                          if (window.confirm('Are you sure you want to delete this comment?')) {
                            // Call API to delete comment
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to leave a comment!</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="post-detail-page">
      <Link to="/" className="back-link">
        &larr; Back to posts
      </Link>
      
      {renderContent()}
    </div>
  );
};

export default PostDetail;