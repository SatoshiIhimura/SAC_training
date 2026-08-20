import { authenticatedRequest } from '../../api/apiClient'

export function getPosts(accessToken, page = 0, size = 20) {
  return authenticatedRequest(`/api/posts?page=${page}&size=${size}`, accessToken)
}

export function createPost(accessToken, post) {
  return authenticatedRequest('/api/posts', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      ...post,
      title: post.title.trim(),
      body: post.body.trim(),
      deadline: post.deadline || null,
    }),
  })
}
