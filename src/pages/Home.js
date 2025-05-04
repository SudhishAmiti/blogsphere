// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from '../services/blogApi';
import { useAuth } from '../hooks/useAuth';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/common/Button';
import PostCard from '../components/blog/PostCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Pagination from '../components/common/Pagination';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Set up search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch posts with pagination and search
  const { data, error, isLoading, isFetching } = useGetPostsQuery({
    page: currentPage,
    search: debouncedSearch,
  });
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Create New Post button for authenticated users
  const newPostButton = isAuthenticated ? (
    <Link to="/create">
      <Button variant="primary">Create New Post</Button>
    </Link>
  ) : null;
  
  return (
    <div className="home-page">
      <PageTitle 
        title="Welcome to BlogSphere" 
        subtitle="Discover and share ideas with our community"
        action={newPostButton}
      >
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </PageTitle>
      
      {error ? (
        <div className="error-message">
          <p>Error loading posts. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      ) : isLoading ? (
        <div className="posts-grid">
          <SkeletonLoader type="card" count={6} />
        </div>
      ) : data?.results?.length === 0 ? (
        <div className="empty-state">
          <h2>No posts found</h2>
          {debouncedSearch ? (
            <p>No posts match your search criteria. Try a different search term.</p>
          ) : (
            <p>There are no posts yet. Be the first to create one!</p>
          )}
          {isAuthenticated && (
            <Link to="/create">
              <Button variant="primary">Create New Post</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="posts-grid">
            {data?.results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data?.count / 10) || 1}
            onPageChange={handlePageChange}
          />
          
          {isFetching && !isLoading && (
            <div className="loading-indicator">
              <p>Loading...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;