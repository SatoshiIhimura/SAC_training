import { useCallback, useEffect, useState } from 'react'
import { createPost, getPosts } from './postsApi'
import './posts.css'

const INITIAL_FORM = { title: '', body: '', importance: 'MEDIUM', deadline: '' }
const IMPORTANCE_LABEL = { HIGH: '高', MEDIUM: '中', LOW: '低' }

export default function PostPage({ auth, onLogout }) {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    try { setPosts((await getPosts(auth.accessToken)).content) }
    catch (requestError) { setError(requestError.message); if (requestError.status === 401) onLogout() }
    finally { setIsLoading(false) }
  }, [auth.accessToken, onLogout])

  useEffect(() => { loadPosts() }, [loadPosts])

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError(''); setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setIsSubmitting(true)
    try { const result = await createPost(auth.accessToken, form); setMessage(result.message); setForm(INITIAL_FORM); await loadPosts() }
    catch (requestError) { setError(requestError.message) }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="board-shell">
      <header className="board-header">
        <div className="brand"><span className="brand-mark">P</span><div><p>POST SYSTEM</p><h1>社内連絡用掲示板</h1></div></div>
        <div className="account-menu"><span className="user-avatar">{auth.userName.slice(0, 1).toUpperCase()}</span><span>{auth.userName}</span><button type="button" onClick={onLogout}>ログアウト</button></div>
      </header>
      <main className="board-main">
        <section className="board-intro"><div><p className="eyebrow">INFORMATION BOARD</p><h2>投稿一覧</h2><p>社内のお知らせや引継ぎ事項を共有できます。</p></div><span className="post-count">{posts.length}件の投稿</span></section>
        <div className="board-layout">
          <section className="composer-card" aria-labelledby="composer-title">
            <div className="section-heading"><span className="section-number">01</span><div><h2 id="composer-title">新しい投稿</h2><p>必要事項を入力して共有します</p></div></div>
            <form onSubmit={handleSubmit}>
              <div className="board-field"><label htmlFor="post-title">タイトル<span>*</span><small>{form.title.length}/100</small></label><input id="post-title" name="title" maxLength="100" required placeholder="投稿のタイトル" value={form.title} onChange={updateField} /></div>
              <div className="board-field"><label htmlFor="post-body">本文<span>*</span><small>{form.body.length}/2000</small></label><textarea id="post-body" name="body" maxLength="2000" required rows="7" placeholder="共有する内容を入力してください" value={form.body} onChange={updateField} /></div>
              <div className="board-field-row">
                <div className="board-field"><label htmlFor="importance">重要度<span>*</span></label><select id="importance" name="importance" value={form.importance} onChange={updateField}><option value="HIGH">高</option><option value="MEDIUM">中</option><option value="LOW">低</option></select></div>
                <div className="board-field"><label htmlFor="deadline">掲載期限<em>任意</em></label><input id="deadline" name="deadline" type="date" min={new Date().toISOString().slice(0, 10)} value={form.deadline} onChange={updateField} /></div>
              </div>
              {error && <p className="board-notice is-error" role="alert">{error}</p>}{message && <p className="board-notice is-success" role="status">{message}</p>}
              <button className="publish-button" type="submit" disabled={isSubmitting}>{isSubmitting ? '投稿しています…' : '投稿する'}</button>
            </form>
          </section>
          <section className="feed" aria-live="polite">
            <div className="section-heading feed-heading"><span className="section-number">02</span><div><h2>最新のお知らせ</h2><p>新しい投稿から順に表示しています</p></div></div>
            {isLoading ? <div className="feed-state">投稿を読み込んでいます…</div> : posts.length === 0 ? <div className="feed-state"><strong>投稿はまだありません</strong><span>左のフォームから最初のお知らせを投稿できます。</span></div> : posts.map((post) => (
              <article className={`post-card importance-${post.importance.toLowerCase()}`} key={post.postId}>
                <div className="post-card-top"><span className="importance-badge">重要度 {IMPORTANCE_LABEL[post.importance]}</span><time>{formatDateTime(post.createdAt)}</time></div>
                <h3>{post.title}</h3><p className="post-body">{post.body}</p>
                <footer><span className="author-avatar">{post.authorName.slice(0, 1).toUpperCase()}</span><span>投稿者：{post.authorName}</span>{post.deadline && <span className="deadline">掲載期限：{post.deadline}</span>}</footer>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

function formatDateTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}
