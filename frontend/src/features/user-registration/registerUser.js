export async function registerUser(formValues) {
  let response

  try {
    response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: formValues.userName.trim(),
        password: formValues.password,
        passwordConfirm: formValues.passwordConfirm,
        age: Number(formValues.age),
      }),
    })
  } catch {
    throw new Error('サーバーに接続できません。Spring Bootが起動しているか確認してください。')
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(body.message || 'ユーザー登録に失敗しました。')
    error.fieldErrors = body.fieldErrors || []
    throw error
  }

  return body
}
