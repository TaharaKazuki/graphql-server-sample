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

  enum SortOP {
    ASC
    DESC
  }

  type Query {
    books: [Book]
    users(limit: Int, age_sort: SortOP): [User]
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
    users: (_parent, args) => {
      let result = users
      let limit = args.limit || null
      let age_sort = args.age_sort || ''
      console.info('通過')
      if (age_sort) {
        const ope = age_sort === 'ASC' ? 1 : -1

        resutl = users.sort((x, y) => {
          if (x['age'] > y['age']) return ope
          if (x['age'] < y['age']) return -ope
          return 0
        })
      }

      if (limit) {
        result = result.slice(0, limit)
      }

      return result
    }
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
