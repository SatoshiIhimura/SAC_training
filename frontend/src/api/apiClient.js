const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  } catch {
    throw new Error('サーバーに接続できません。Spring Bootが起動しているか確認してください。')
  }

  const body = response.status === 204 ? null : await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(body?.message || '処理に失敗しました。')
    error.status = response.status
    error.errorCode = body?.errorCode
    error.fieldErrors = body?.fieldErrors || []
    throw error
  }

  return body
}

export function authenticatedRequest(path, accessToken, options = {}) {
  return apiRequest(path, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
