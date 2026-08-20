import { useState } from 'react'
import RegisterPage from './features/user-registration/RegisterPage'
import LoginPage from './features/auth/LoginPage'
import PostPage from './features/posts/PostPage'

export default function App() {
  const saved = sessionStorage.getItem('post-system-auth')
  const [auth, setAuth] = useState(saved ? JSON.parse(saved) : null)
  const [page, setPage] = useState(auth ? 'posts' : (location.pathname === '/register' ? 'register' : 'login'))

  const navigate = (nextPage) => {
    const path = nextPage === 'posts' ? '/posts' : nextPage === 'login' ? '/login' : '/register'
    window.history.pushState({}, '', path)
    setPage(nextPage)
  }

  const loggedIn = (data) => { sessionStorage.setItem('post-system-auth', JSON.stringify(data)); setAuth(data); navigate('posts') }
  const logout = () => { sessionStorage.removeItem('post-system-auth'); setAuth(null); navigate('login') }
  if (page === 'posts' && auth) return <PostPage auth={auth} onLogout={logout} />
  if (page === 'register') return <RegisterPage onRegistered={() => navigate('login')} onBack={() => navigate('login')} />
  return <LoginPage onLoggedIn={loggedIn} onRegister={() => navigate('register')} />
}
