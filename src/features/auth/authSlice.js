import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage if available
const loadAuthFromStorage = () => {
  try {
    const serializedAuth = localStorage.getItem('auth');
    if (serializedAuth === null) {
      return {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }
    return JSON.parse(serializedAuth);
  } catch (e) {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
};

const initialState = loadAuthFromStorage();

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.token = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify(state));
    },
    updateToken: (state, action) => {
      state.token = action.payload.access;
      if (action.payload.refresh) {
        state.refreshToken = action.payload.refresh;
      }

      // Update localStorage
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear from localStorage
      localStorage.removeItem('auth');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;

      // Update localStorage
      localStorage.setItem('auth', JSON.stringify(state));
    },
  },
});

// Export actions and reducer
export const { setCredentials, updateToken, logOut, setLoading, updateUser } =
  authSlice.actions;
export default authSlice.reducer;