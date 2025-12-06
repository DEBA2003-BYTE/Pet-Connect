import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
  }

  const signup = async (userData: any) => {
    const { data } = await api.post('/auth/signup', userData)
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
