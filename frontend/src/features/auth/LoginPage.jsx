import { useState } from 'react'
import { login } from './authApi'
import '../user-registration/registration.css'

export default function LoginPage({ onLoggedIn, onRegister }) {
  const [values, setValues] = useState({ userName: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateValue = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try { onLoggedIn(await login(values)) }
    catch (requestError) { setError(requestError.message) }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="app-shell">
      <header className="site-header"><h1>社内連絡用掲示板</h1></header>
      <main className="register-main">
        <section className="register-card" aria-labelledby="login-title">
          <div className="card-heading"><p className="eyebrow">POST SYSTEM</p><h2 id="login-title">ログイン</h2><p>登録済みのアカウントで掲示板を利用します</p></div>
          <form onSubmit={handleSubmit}>
            <div className="form-field"><label htmlFor="login-user-name">ユーザー名<span className="required">*</span></label><input id="login-user-name" name="userName" autoComplete="username" value={values.userName} onChange={updateValue} required /></div>
            <div className="form-field"><label htmlFor="login-password">パスワード<span className="required">*</span></label><input id="login-password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={updateValue} required /></div>
            <div className={`form-message ${error ? 'is-visible' : ''}`} role="alert">{error || '　'}</div>
            <div className="form-actions"><button className="button button-secondary" type="button" onClick={onRegister}>新規登録へ</button><button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'ログイン中…' : 'ログイン'}</button></div>
          </form>
        </section>
      </main>
    </div>
  )
}
