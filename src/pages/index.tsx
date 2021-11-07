import React from 'react'

const index = () => {
  console.log(process.env.GATSBY_FaunaDB_Secret_Key)
  return <div>Home page</div>
}

export default index
