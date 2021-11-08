import { useQuery, gql, useMutation } from '@apollo/client'

import React from 'react'

const GET_ALL_TODO = gql`
  query {
    todoList {
      id
      name
      completed
      userid
    }
  }
`
const ADD_TASK = gql`
  mutation ($name: String!) {
    addTodo(name: $name) {
      name
    }
  }
`

type taskprops = {
  name: string
  completed: string
  id: string
}

const index = () => {
  const { loading, error, data } = useQuery(GET_ALL_TODO)
  const [addTodo, { loading: addloading, error: adderror }] = useMutation(
    ADD_TASK,
    {
      refetchQueries: [{ query: GET_ALL_TODO }],
    }
  )
  if (loading || addloading) {
    return <h1>Loading...</h1>
  }
  if (error) {
    console.log(error)
    return <h1>Error...</h1>
  }
  console.log(data)
  let name: HTMLInputElement | null
  const onSubmit = async () => {
    console.log(name?.value)
    if (name?.value === '') {
      console.log('TASK CANT BE EMPTY')
      return {}
    }
    try {
      await addTodo({
        variables: { name: name?.value },
      })

      // toast.success('Category Updated')
      // Router.push('/dashboard/category')
    } catch (error) {
      console.log(error)
      // toast.error(error.message)
    }
  }

  return (
    <div>
      <div className='flex justify-center '>
        <div className='mt-7 flex rounded-md shadow-sm w-screen max-w-lg '>
          <div className='relative flex items-stretch flex-grow focus-within:z-10'>
            <input
              type='text'
              name='task'
              id='task'
              ref={(node) => (name = node)}
              required
              className='focus:ring-indigo-500  focus:border-none focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-4 sm:text-sm border-2 border-gray-500'
              placeholder='Enter Todo...'
            />
          </div>
          <button
            onClick={() => onSubmit()}
            className='-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
          >
            <span>ADD TASK</span>
          </button>
        </div>
      </div>
      {/* ALL TOTOS LIST */}
      <div className='flex justify-center '>
        <div className='flow-root mt-6 w-screen max-w-6xl'>
          <ul className='-my-5 divide-y divide-gray-200'>
            {data.todoList.map((task: taskprops) => (
              <li key={task.id} className='py-4'>
                <div className='flex items-center space-x-4'>
                  <div className='flex-1 min-w-0 flex'>
                    {/* <span className=' text-lg font-medium text-gray-500 '>
                      {index + 1}:
                    </span> */}
                    <p className=' text-lg font-medium text-gray-900 truncate'>
                      {task.name}
                    </p>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50'
                    >
                      Completed
                    </a>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50'
                    >
                      Edit
                    </a>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50'
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default index
