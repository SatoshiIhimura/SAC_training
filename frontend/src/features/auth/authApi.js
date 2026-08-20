import { apiRequest, authenticatedRequest } from '../../api/apiClient'

export function login(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser(accessToken) {
  return authenticatedRequest('/api/auth/me', accessToken)
}

export function logout(accessToken) {
  return authenticatedRequest('/api/auth/logout', accessToken, { method: 'POST' })
}
