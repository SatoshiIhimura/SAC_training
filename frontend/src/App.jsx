import { useEffect, useState } from 'react'
import LoginPage from './features/authentication/LoginPage'
import LoginSuccessPage from './features/authentication/LoginSuccessPage'
import RegisterPage from './features/user-registration/RegisterPage'

function getInitialPage() {
  return window.location.pathname === '/register' ? 'register' : 'login'
}

export default function App() {
  const [page, setPage] = useState(getInitialPage)
  const [loginUser, setLoginUser] = useState(null)

  useEffect(() => {
    const handlePopState = () => setPage(getInitialPage())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPage) => {
    const path = nextPage === 'register' ? '/register' : '/login'
    window.history.pushState({}, '', path)
    setPage(nextPage)
  }

  if (page === 'register') {
    return <RegisterPage onRegistered={() => navigate('login')} onBack={() => navigate('login')} />
  }

  if (page === 'success') {
    return <LoginSuccessPage user={loginUser} onBack={() => navigate('login')} />
  }

  return (
    <LoginPage
      onRegister={() => navigate('register')}
      onLogin={(user) => {
        setLoginUser(user)
        setPage('success')
      }}
    />
  )
}
