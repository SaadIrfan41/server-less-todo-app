import React from 'react'
import Navbar from './Navbar'
// import { useStaticQuery, graphql } from "gatsby"

const Layout: React.FC = ({ children }) => {
  return (
    <div className='h-screen'>
      <Navbar />

      {children}
      {/* <Footer /> */}
    </div>
  )
}

export default Layout
