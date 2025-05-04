import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../features/blog/blogSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.blog.theme);
  
  useEffect(() => {
    // Load theme from localStorage on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== theme) {
      dispatch(setTheme(savedTheme));
    }
    
    // Apply theme to document body
    document.body.dataset.theme = theme;
  }, [theme, dispatch]);
  
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  return { theme, toggleTheme: handleToggleTheme };
};