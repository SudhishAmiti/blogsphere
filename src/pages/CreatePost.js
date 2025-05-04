// src/pages/CreatePost.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePostMutation } from '../services/blogApi';
import { useAuth } from '../hooks/useAuth';
import { handleApiError } from '../utils/handleApiError';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/common/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createPost, { isLoading }] = useCreatePostMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featured_image: null,
    published: true,
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  
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
  
  // Handle text/checkbox input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  // Handle rich text editor changes
  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
    
    // Clear error when user types
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: '',
      }));
    }
  };
  
  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        featured_image: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.featured_image) {
        setErrors((prev) => ({
          ...prev,
          featured_image: '',
        }));
      }
    }
  };
  
  // Clear file input
  const handleClearImage = () => {
    setFormData((prev) => ({
      ...prev,
      featured_image: null,
    }));
    setPreviewImage(null);
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
    postData.append('author_id', user.id);
    
    if (formData.featured_image) {
      postData.append('featured_image', formData.featured_image);
    }
    
    try {
      // Call create post API
      const response = await createPost(postData).unwrap();
      
      toast.success('Post created successfully!');
      navigate(`/post/${response.slug}`);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  return (
    <div className="create-post-page">
      <PageTitle title="Create a New Post" />
      
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
              disabled={isLoading}
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
                disabled={isLoading}
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
              readOnly={isLoading}
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
                disabled={isLoading}
              />
              Publish immediately
            </label>
          </div>
          
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Post...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;