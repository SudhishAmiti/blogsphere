import { apiSlice } from './apiSlice';

// Extend the apiSlice with auth endpoints
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: (refresh_token) => ({
        url: 'auth/logout/',
        method: 'POST',
        body: { refresh_token },
      }),
    }),
    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: 'auth/login/refresh/',
        method: 'POST',
        body: { refresh },
      }),
    }),
    getUserDetails: builder.query({
      query: () => 'auth/user/',
      providesTags: ['User'],
    }),
    updateUserDetails: builder.mutation({
      query: (userData) => ({
        url: 'auth/user/',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} = authApi;