// src/components/blog/PostCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import { truncateText } from '../../utils/truncateText';

const PostCard = ({ post }) => {
  const { id, title, slug, content, author, featured_image, created_at, comment_count } = post;
  
  // Default avatar placeholder URL
  const avatarUrl = `https://ui-avatars.com/api/?name=${author.first_name}+${author.last_name}&background=random`;
  
  // Format date
  const formattedDate = formatDate(created_at);
  
  // Extract an excerpt from content
  const excerpt = content ? truncateText(content, 120) : '';
  
  return (
    <div className="post-card">
      {featured_image ? (
        <div 
          className="post-image" 
          style={{ backgroundImage: `url(${featured_image})` }}
        ></div>
      ) : (
        <div className="post-image"></div>
      )}
      
      <div className="post-content">
        <h2 className="post-title">
          <Link to={`/post/${slug}`}>{title}</Link>
        </h2>
        
        <p className="post-excerpt">{excerpt}</p>
        
        <div className="post-meta">
          <div className="post-author">
            <div className="author-avatar">
              <img src={avatarUrl} alt={`${author.first_name} ${author.last_name}`} />
            </div>
            <span>{author.first_name} {author.last_name}</span>
          </div>
          
          <div className="post-info">
            <span>{formattedDate}</span>
            {comment_count !== undefined && (
              <span> • {comment_count} {comment_count === 1 ? 'comment' : 'comments'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;