const { ApolloServer, gql } = require('apollo-server-lambda')
const FaunaService = require('@brianmmdev/faunaservice')
// const faunadb = require('faunadb')

// const client = new faunadb.Client({
//   secret: process.env.FaunaDB_Secret_Key,
// })
const service = new FaunaService(process.env.FaunaDB_Secret_Key)
// const q = faunadb.query

const typeDefs = gql`
  type Query {
    todos: [Task]!
  }
  type Task {
    id: ID!
    name: String!
    userid: ID!
    completed: Boolean!
  }

  type Mutation {
    addTodo(name: String!): Task
    updateTodo(id: ID!, name: String): Task
    deleteTodo(id: ID!): Task
    updateCompleted(id: ID!): Task
  }
`

const resolvers = {
  Query: {
    todoList: async (_, _, { user }) => {
      if (!user) return []
      try {
        const tasks = await service.listRecords('todos')
        tasks = tasks.filter((t) => t.userid === user)
        return tasks.map(([ref, name, completed]) => ({
          id: ref.id,
          name,
          completed,
        }))
      } catch (error) {
        console.log(error)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if (context?.clientContext?.user) {
      return { user: context?.clientContext?.user?.sub }
    } else {
      return {}
    }
  },
})

const handler = server.createHandler()

module.exports = { handler }
