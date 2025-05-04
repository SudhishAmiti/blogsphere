// src/pages/EditPost.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPostBySlugQuery, useUpdatePostMutation } from '../services/blogApi';
import { useAuth } from '../hooks/useAuth';
import { handleApiError } from '../utils/handleApiError';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch post data
  const { data: post, error, isLoading } = useGetPostBySlugQuery(slug);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featured_image: null,
    published: true,
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  
  // Rich text editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'code-block',
  ];
  
  // Update form data when post data is loaded
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        published: post.published !== undefined ? post.published : true,
        featured_image: null, // We don't load the file, just show the current image
      });
      
      if (post.featured_image) {
        setPreviewImage(post.featured_image);
      }
    }
  }, [post]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  // Handle rich text editor changes
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content,
    }));
    
    // Clear error when user types
    if (errors.content) {
      setErrors(prev => ({
        ...prev,
        content: '',
      }));
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        featured_image: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Mark that image was changed
      setImageChanged(true);
      
      // Clear error
      if (errors.featured_image) {
        setErrors(prev => ({
          ...prev,
          featured_image: '',
        }));
      }
    }
  };
  
  // Clear file input
  const handleClearImage = () => {
    setFormData(prev => ({
      ...prev,
      featured_image: null,
    }));
    setPreviewImage(null);
    setImageChanged(true);
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Create FormData object for API call (including file upload)
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('content', formData.content);
    postData.append('published', formData.published);
    
    // Only append image if it was changed
    if (imageChanged) {
      if (formData.featured_image) {
        postData.append('featured_image', formData.featured_image);
      } else {
        // If image was cleared, we need to tell the backend to remove it
        postData.append('remove_image', 'true');
      }
    }
    
    try {
      // Call update post API
      await updatePost({
        slug,
        data: postData,
      }).unwrap();
      
      toast.success('Post updated successfully!');
      navigate(`/post/${slug}`);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // Check user authorization
  useEffect(() => {
    if (post && user && post.author.id !== user.id) {
      toast.error("You don't have permission to edit this post");
      navigate(`/post/${slug}`);
    }
  }, [post, user, slug, navigate]);
  
  // If post is loading, show skeleton
  if (isLoading) {
    return (
      <div className="edit-post-page">
        <PageTitle title="Edit Post" />
        <SkeletonLoader type="post-detail" />
      </div>
    );
  }
  
  // If there's an error or post not found
  if (error || !post) {
    return (
      <div className="edit-post-page">
        <PageTitle title="Edit Post" />
        <div className="error-message">
          <h2>Error loading post</h2>
          <p>The post you're trying to edit could not be found or there was an error loading it.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="edit-post-page">
      <PageTitle title="Edit Post" />
      
      <div className="form-container large">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isUpdating}
              placeholder="Enter a title for your post"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="featured_image">Featured Image</label>
            <div className="file-input-container">
              <input
                type="file"
                id="featured_image"
                name="featured_image"
                onChange={handleFileChange}
                disabled={isUpdating}
                accept="image/*"
              />
              
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image" 
                    onClick={handleClearImage}
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {errors.featured_image && (
                <div className="error-message">{errors.featured_image}</div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Write your post content here..."
              readOnly={isUpdating}
            />
            {errors.content && <div className="error-message">{errors.content}</div>}
          </div>
          
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                disabled={isUpdating}
              />
              Published
            </label>
          </div>
          
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/post/${slug}`)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating Post...' : 'Update Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;