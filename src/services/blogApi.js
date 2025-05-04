// src/services/blogApi.js

import { apiSlice } from './apiSlice';

// Extend the apiSlice with blog endpoints
export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, search = '' }) => ({
        url: `blog/posts/`,
        params: { page, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Post',
                id,
              })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPostBySlug: builder.query({
      query: (slug) => `blog/posts/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Post', id: slug }],
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: 'blog/posts/',
        method: 'POST',
        body: postData,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: ({ slug, data }) => ({
        url: `blog/posts/${slug}/`,
        method: 'PATCH',
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Post', id: slug },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    deletePost: builder.mutation({
      query: (slug) => ({
        url: `blog/posts/${slug}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    addComment: builder.mutation({
      query: ({ slug, content }) => ({
        url: `blog/posts/${slug}/add_comment/`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { slug }) => [{ type: 'Post', id: slug }],
    }),
    getComments: builder.query({
      query: (postId) => ({
        url: 'blog/comments/',
        params: { post: postId },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Comment',
                id,
              })),
              { type: 'Comment', id: 'LIST' },
            ]
          : [{ type: 'Comment', id: 'LIST' }],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `blog/comments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment', id },
        { type: 'Comment', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetPostBySlugQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
  useGetCommentsQuery,
  useDeleteCommentMutation,
} = blogApi;