import { createSlice } from '@reduxjs/toolkit';

// Get theme from localStorage if available
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' ? 'dark' : 'light';
};

// Initialize state
const initialState = {
  theme: getInitialTheme(),
  loadingStatus: 'idle',
  error: null,
};

// Create the blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', state.theme);
    },
    setLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions and reducer
export const { toggleTheme, setTheme, setLoadingStatus, setError } = blogSlice.actions;
export default blogSlice.reducer;