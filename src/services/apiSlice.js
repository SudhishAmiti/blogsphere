import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for API calls
const baseUrl = 'http://localhost:8000/api/';

// Create API slice with authentication
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = getState().auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Post', 'Comment', 'User'],
  endpoints: () => ({}),
});