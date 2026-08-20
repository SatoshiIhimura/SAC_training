import { useState } from 'react'
import { loginUser } from './loginUser'
import { validateLogin } from './validation'
import '../user-registration/registration.css'
import './authentication.css'

const INITIAL_VALUES = { userName: '', password: '' }

export default function LoginPage({ onLogin, onRegister }) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateValue = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setGeneralError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateLogin(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setGeneralError('入力内容を確認してください。')
      return
    }

    setIsSubmitting(true)
    setGeneralError('')

    try {
      const user = await loginUser(values)
      onLogin(user)
    } catch (error) {
      setGeneralError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header"><h1>社内連絡用掲示板</h1></header>
      <main className="register-main">
        <section className="register-card login-card" aria-labelledby="login-title">
          <div className="card-heading">
            <p className="eyebrow">POST SYSTEM</p>
            <h2 id="login-title">ログイン</h2>
            <p>登録済みのユーザー情報を入力してください</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <LoginField
              id="login-userName"
              name="userName"
              label="ユーザー名"
              value={values.userName}
              onChange={updateValue}
              error={errors.userName}
              placeholder="例：satoshi"
              autoComplete="username"
            />
            <LoginField
              id="login-password"
              name="password"
              type="password"
              label="パスワード"
              value={values.password}
              onChange={updateValue}
              error={errors.password}
              placeholder="パスワードを入力"
              autoComplete="current-password"
            />

            <div className={`form-message ${generalError ? 'is-visible' : ''}`} role="alert">
              {generalError || '　'}
            </div>

            <button className="button button-primary login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '確認中…' : 'ログイン'}
            </button>

            <p className="register-guidance">
              アカウントをお持ちでない方
              <button type="button" className="text-button" onClick={onRegister}>
                新規登録はこちら
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

function LoginField({ id, label, error, type = 'text', ...inputProps }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}<span className="required">*</span></label>
      <input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}
