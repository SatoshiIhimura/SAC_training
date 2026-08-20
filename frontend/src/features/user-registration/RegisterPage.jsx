import { useState } from 'react'
import { registerUser } from './userRegistrationApi'
import { validateRegistration } from './validation'
import './registration.css'

const INITIAL_VALUES = {
  userName: '',
  password: '',
  passwordConfirm: '',
  age: '',
}

export default function RegisterPage({ onRegistered, onBack }) {
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
    const validationErrors = validateRegistration(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setGeneralError('入力内容を確認してください。')
      return
    }

    setIsSubmitting(true)
    setGeneralError('')

    try {
      await registerUser(values)
      window.alert('ユーザー登録が完了しました。')
      onRegistered()
    } catch (error) {
      const serverFieldErrors = Object.fromEntries(
        (error.fieldErrors || []).map((fieldError) => [fieldError.field, fieldError.message]),
      )
      setErrors(serverFieldErrors)
      setGeneralError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>社内連絡用掲示板</h1>
      </header>

      <main className="register-main">
        <section className="register-card" aria-labelledby="register-title">
          <div className="card-heading">
            <p className="eyebrow">POST SYSTEM</p>
            <h2 id="register-title">新規ユーザー登録</h2>
            <p>掲示板を利用するためのアカウントを作成します</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <FormField
              id="userName"
              label="ユーザー名"
              note="4～50文字"
              value={values.userName}
              onChange={updateValue}
              error={errors.userName}
              placeholder="半角英数字・ハイフン・アンダースコア"
              autoComplete="username"
              maxLength={50}
            />

            <FormField
              id="password"
              label="パスワード"
              note="8～50文字"
              type="password"
              value={values.password}
              onChange={updateValue}
              error={errors.password}
              placeholder="半角英字と数字を組み合わせて入力"
              autoComplete="new-password"
              maxLength={50}
            />

            <FormField
              id="passwordConfirm"
              label="確認用パスワード"
              type="password"
              value={values.passwordConfirm}
              onChange={updateValue}
              error={errors.passwordConfirm}
              placeholder="パスワードをもう一度入力"
              autoComplete="new-password"
              maxLength={50}
            />

            <FormField
              id="age"
              label="年齢"
              type="number"
              value={values.age}
              onChange={updateValue}
              error={errors.age}
              placeholder="例：22"
              min="0"
              max="119"
              inputMode="numeric"
              className="age-field"
            />

            <div className={`form-message ${generalError ? 'is-visible' : ''}`} role="alert">
              {generalError || '　'}
            </div>

            <div className="form-actions">
              <button className="button button-secondary" type="button" onClick={onBack}>
                ログイン画面へ戻る
              </button>
              <button className="button button-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? '登録中…' : '登録する'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

function FormField({ id, label, note, error, className = '', type = 'text', ...inputProps }) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id}>
        {label}<span className="required">*</span>
        {note && <span className="field-note">{note}</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}
