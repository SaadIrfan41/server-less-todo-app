import { useQuery, gql } from '@apollo/client'

import React from 'react'

const GET_TODO = gql`
  query {
    todoList {
      id
      name
      completed
      userid
    }
  }
`

const index = () => {
  const { loading, error, data } = useQuery(GET_TODO)
  if (loading) {
    return <h1>Loading...</h1>
  }
  if (error) {
    console.log(error)
    return <h1>Error...</h1>
  }
  console.log(data)

  // console.log(process.env.GATSBY_FaunaDB_Secret_Key)
  return <div>Home page</div>
}

export default index
