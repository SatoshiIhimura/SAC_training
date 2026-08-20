import '../user-registration/registration.css'
import './authentication.css'

export default function LoginSuccessPage({ user, onBack }) {
  return (
    <div className="app-shell">
      <header className="site-header"><h1>社内連絡用掲示板</h1></header>
      <main className="register-main">
        <section className="register-card success-card">
          <div className="success-mark" aria-hidden="true">✓</div>
          <h2>ログインしました</h2>
          <p>{user?.userName ? `${user.userName} さん` : '認証に成功しました。'}</p>
          <p className="success-note">投稿一覧画面は次の実装工程で接続します。</p>
          <button className="button button-secondary" type="button" onClick={onBack}>
            ログイン画面へ戻る
          </button>
        </section>
      </main>
    </div>
  )
}
