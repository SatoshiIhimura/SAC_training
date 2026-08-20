export function validateLogin(values) {
  const errors = {}
  if (!values.userName.trim()) errors.userName = 'ユーザー名を入力してください。'
  if (!values.password) errors.password = 'パスワードを入力してください。'
  return errors
}
