import React from 'react';
import './SkeletonLoader.scss';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text skeleton-text-short"></div>
          </div>
        );
      case 'text':
        return <div className="skeleton-text"></div>;
      case 'title':
        return <div className="skeleton-title"></div>;
      case 'avatar':
        return <div className="skeleton-avatar"></div>;
      case 'post-detail':
        return (
          <div className="skeleton-post-detail">
            <div className="skeleton-title"></div>
            <div className="skeleton-avatar-row">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-meta">
                <div className="skeleton-text skeleton-text-short"></div>
                <div className="skeleton-text skeleton-text-shorter"></div>
              </div>
            </div>
            <div className="skeleton-image large"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        );
      default:
        return <div className="skeleton-card"></div>;
    }
  };

  return (
    <>
      {Array(count)
        .fill()
        .map((_, index) => (
          <div key={index} className="skeleton-item">
            {renderSkeleton()}
          </div>
        ))}
    </>
  );
};

export default SkeletonLoader;