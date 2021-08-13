const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { users } = require('./users')

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type User {
    id: Int
    name: String
    age: Int
    created_date: String
  }

  type Query {
    books: [Book]
    users: [User]
  }
`

const books = [
  {
    title: 'The Sample',
    author: 'Kate'
  },
  {
    title: 'City sample',
    author: 'Paul'
  }
]

const resolvers = {
  Query: {
    books: () => books,
    users: () => users
  }
}

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers })

  await server.start()
  const app = express()
  server.applyMiddleware({
    app,
    path: '/'
  })

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve))
  console.info(`Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer(typeDefs, resolvers)
