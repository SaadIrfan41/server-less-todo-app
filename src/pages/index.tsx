import { useQuery, gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import React, { useContext, useEffect } from 'react'
import withReactContent from 'sweetalert2-react-content'
import AuthContext from '../utils/authContext'
import { toast } from 'react-toastify'

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

const UPDATE_TASK = gql`
  mutation ($id: ID!, $name: String!) {
    updateTodo(id: $id, name: $name) {
      name
    }
  }
`

const UPDATE_TASK_COMPLETED = gql`
  mutation ($id: ID!, $completed: Boolean!) {
    updateCompleted(id: $id, completed: $completed) {
      completed
    }
  }
`
const DELETE_TASK = gql`
  mutation ($id: ID!) {
    deleteTodo(id: $id) {
      name
    }
  }
`

type taskprops = {
  name: string
  completed: Boolean
  id: string
}

const index = () => {
  const { user } = useContext(AuthContext)
  const { loading, refetch, error, data } = useQuery(GET_ALL_TODO)
  useEffect(() => {
    refetch()
    console.log('UseEffect is called')
  }, [user])

  const [addTodo, { loading: addloading, error: adderror }] = useMutation(
    ADD_TASK,
    {
      refetchQueries: [{ query: GET_ALL_TODO }],
    }
  )
  const [updateTodo, { loading: updateloading, error: updateerror }] =
    useMutation(UPDATE_TASK, {
      refetchQueries: [{ query: GET_ALL_TODO }],
    })

  const [
    updateCompleted,
    { loading: updateCompletedloading, error: updateCompletederror },
  ] = useMutation(UPDATE_TASK_COMPLETED, {
    refetchQueries: [{ query: GET_ALL_TODO }],
  })

  const [deleteTodo, { loading: deleteloading, error: deleteerror }] =
    useMutation(DELETE_TASK, {
      refetchQueries: [{ query: GET_ALL_TODO }],
    })

  if (
    loading ||
    addloading ||
    updateloading ||
    updateCompletedloading ||
    deleteloading
  ) {
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
      toast.success('TODO ADDED')

      // Router.push('/dashboard/category')
    } catch (error) {
      // console.log(error)
      //@ts-ignore
      toast.error(error.message)
    }
  }

  const handleEdit = async (id: string) => {
    const result = await Swal.fire({
      title: 'Enter Task',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      backdrop: true,
      confirmButtonText: 'Submit',
      allowOutsideClick: () => !Swal.isLoading(),
    })

    if (result.value) {
      console.log(result.value)
      await updateTodo({
        variables: { id: id, name: result.value },
      })
      toast.success('TODO UPDATED')
    }
  }

  const handleCompleted = async (id: string, completed: Boolean) => {
    console.log(id, completed)
    try {
      const res = await updateCompleted({
        variables: { id, completed },
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  const handelDelete = async (id: string) => {
    try {
      await deleteTodo({ variables: { id } })
      toast.error('TODO DELETED')
    } catch (error) {
      console.log(error)
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
            {data?.todoList?.map((task: taskprops) => (
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
                    <button
                      onClick={() => {
                        handleCompleted(task.id, task.completed)
                      }}
                      className={`${
                        task.completed
                          ? 'bg-green-300 inline-flex items-center shadow-sm px-2.5 py-0.5 border  text-sm leading-5 font-medium rounded-full text-green-900 hover:bg-green-500'
                          : 'bg-yellow-300 inline-flex items-center shadow-sm px-2.5 py-0.5 border  text-sm leading-5 font-medium rounded-full text-yellow-900 hover:bg-yellow-500'
                      } `}
                    >
                      {task.completed ? 'Completed' : 'Pending...'}
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        console.log(task.id)
                        handleEdit(task.id)
                      }}
                      className='inline-flex hover:bg-blue-700 hover:text-white text-blue-700 border-2 border-blue-500 border-opacity-100 items-center shadow-sm px-2.5 py-0.5 transition duration-500 text-sm leading-5 font-medium rounded-full  bg-white '
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        console.log(task.id)
                        handelDelete(task.id)
                      }}
                      className='inline-flex hover:bg-red-700 transition duration-500 hover:text-white text-red-700 border border-red-500 border-opacity-100 items-center shadow-sm px-2.5 py-0.5  text-sm leading-5 font-medium rounded-full  bg-white '
                    >
                      Delete
                    </button>
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
