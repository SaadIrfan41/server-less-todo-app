import React from 'react'
import { createContext, useState, useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'

const AuthContext = createContext({
  user: '',
  login: () => {},
  logout: () => {},
  loading: true,
})

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setloading] = useState(true)

  useEffect(() => {
    netlifyIdentity.on('login', (user) => {
      setUser(user)
      netlifyIdentity.close()
      console.log('login event')
    })
    netlifyIdentity.on('logout', () => {
      setUser(null)
      console.log('logout event')
    })
    netlifyIdentity.on('init', (user) => {
      setUser(user)
      setloading(false)
      console.log('init event')
    })

    // init netlify identity connection
    netlifyIdentity.init()

    return () => {
      netlifyIdentity.off('login')
    }
  }, [])

  const login = () => {
    netlifyIdentity.open()
  }

  const logout = () => {
    netlifyIdentity.logout()
  }

  const context = { user, login, logout, loading }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export default AuthContext
