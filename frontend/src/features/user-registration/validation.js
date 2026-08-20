const USER_NAME_PATTERN = /^[A-Za-z0-9_-]+$/
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$/

export function validateRegistration(values) {
  const errors = {}
  const userName = values.userName.trim()

  if (!userName) {
    errors.userName = 'ユーザー名を入力してください。'
  } else if (userName.length < 4) {
    errors.userName = 'ユーザー名は4文字以上で入力してください。'
  } else if (userName.length > 50) {
    errors.userName = 'ユーザー名は50文字以内で入力してください。'
  } else if (!USER_NAME_PATTERN.test(userName)) {
    errors.userName = '半角英数字・ハイフン・アンダースコアのみで入力してください。'
  }

  if (!values.password) {
    errors.password = 'パスワードを入力してください。'
  } else if (values.password.length < 8) {
    errors.password = 'パスワードは8文字以上で入力してください。'
  } else if (values.password.length > 50) {
    errors.password = 'パスワードは50文字以内で入力してください。'
  } else if (!PASSWORD_PATTERN.test(values.password)) {
    errors.password = '半角英字と数字を組み合わせて入力してください。'
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = '確認用パスワードを入力してください。'
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'パスワードが一致しません。'
  }

  if (values.age === '') {
    errors.age = '年齢を入力してください。'
  } else {
    const age = Number(values.age)
    if (!Number.isInteger(age) || age < 0 || age > 119) {
      errors.age = '年齢は0歳以上119歳以下で入力してください。'
    }
  }

  return errors
}
