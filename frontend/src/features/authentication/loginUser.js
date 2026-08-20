export async function loginUser(credentials) {
  let response

  try {
    response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: credentials.userName.trim(),
        password: credentials.password,
      }),
    })
  } catch {
    throw new Error('サーバーに接続できません。Spring Bootが起動しているか確認してください。')
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(body.message || 'ユーザー名またはパスワードが正しくありません。')
  }

  return body
}
