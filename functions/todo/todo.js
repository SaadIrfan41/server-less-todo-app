const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb')

const client = new faunadb.Client({
  secret: process.env.GATSBY_FaunaDB_Secret_Key,
})

const q = faunadb.query

const typeDefs = gql`
  type Query {
    todoList: [Task]!
  }
  type Task {
    id: ID!
    name: String!
    userid: String
    completed: Boolean!
  }

  type Mutation {
    addTodo(name: String!): Task
    updateTodo(id: ID!, name: String): Task
    deleteTodo(id: ID!): Task
    updateCompleted(id: ID!, completed: Boolean!): Task
  }
`

const resolvers = {
  Query: {
    todoList: async (parent, args, { user }) => {
      console.log('USER ID>>>>>>:', user)
      if (!user) return []

      try {
        const results = await client.query(
          q.Paginate(q.Match(q.Index('filter_by_userid'), user))
        )
        return results.data.map(([ref, name, completed]) => ({
          id: ref.id,
          name,
          completed,
        }))
      } catch (error) {
        console.log(error)
      }
    },
  },
  Mutation: {
    addTodo: async (_, { name }, { user }) => {
      console.log('USER ID>>>>>>:', user)
      if (!user) {
        throw new Error('Must be authenticated to insert todos')
      }
      try {
        const result = await client.query(
          q.Create(q.Collection('todos'), {
            data: {
              name: name,
              completed: false,
              userid: user,
            },
          })
        )
        console.log(result)
        return {
          ...result.data,
          id: result.ref.id,
        }
      } catch (err) {
        console.log(err)
      }
    },
    updateTodo: async (_, { id, name }, { user }) => {
      console.log('id: ', id)
      console.log('task: ', name)
      if (!user) {
        throw new Error('Must be authenticated to Update todos')
      }
      try {
        const result = await client.query(
          q.Update(q.Ref(q.Collection('todos'), id), {
            data: {
              name: name,
            },
          })
        )

        console.log(result)
        return {
          ...result.data,
          id: result.ref.id,
        }
      } catch (error) {
        console.log(error)
      }
    },
    deleteTodo: async (_, { id }) => {
      console.log('id: ', id)

      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection('todos'), id))
        )

        console.log(result)
        return result.data
      } catch (error) {
        console.log('ERROR:::>>>', error.description)
      }
    },
    updateCompleted: async (_, { id, completed }) => {
      console.log('id: ', id)
      console.log('Completed: ', completed)

      try {
        const result = await client.query(
          q.Update(q.Ref(q.Collection('todos'), id), {
            data: {
              completed: !completed,
            },
          })
        )

        console.log(result)
        return {
          ...result.data,
          id: result.ref.id,
        }
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
    if (context.clientContext.user) {
      return {
        user: context.clientContext.user.sub,
      }
    } else {
      return { user: null }
    }
  },
  playground: true,
  introspection: true,
})

const handler = server.createHandler()

module.exports = { handler }
