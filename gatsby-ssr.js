import React from 'react'
import Layout from './src/components/Layout'
import { AuthContextProvider } from './src/utils/authContext'
export function wrapPageElement({ element, props }) {
  return (
    <AuthContextProvider>
      <Layout {...props}>{element}</Layout>
    </AuthContextProvider>
  )
}
