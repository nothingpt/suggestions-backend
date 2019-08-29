const { gql } = require("apollo-server-express");

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require("graphql-iso-date");

const customScalarResolver = {
  Date: GraphQLDateTime
};


const typeDefs = gql`
  scalar Date

  interface Node {
    id: ID!
  }

  type SuccessMessage {
    message: String
  }

  type User implements Node {
    id: ID!
    email: String! 
    password: String!
    resetToken: String
    resetTokenExpiry: Float
  }

  type Suggestion implements Node{
    id: ID!
    title: String!
    suggestion: String!
    status: StatusEnum
    comment: String
    created_at: Date
    updated_at: Date
    visible: Boolean
    closed: Boolean
  }

  type Query {
    numberOfSuggestions: Int
    suggestions(all: Boolean = false offset: Int limit: Int): [Suggestion!]!
    suggestion(id: ID): Suggestion
    me: User
    node(id: ID!): Node
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): User
    addSuggestion(input: CreateSuggestionInput!): Suggestion!
    updateSuggestion(
      id: ID!
      status: StatusEnum
      comment: String
      updated_at: Date
      visible: Boolean = false
      closed: Boolean = false
    ): Suggestion
    signout: SuccessMessage
  }

  input CreateSuggestionInput {
    title: String
    suggestion: String!
    status: StatusEnum = "OPEN"
    created_at: Date
    closed: Boolean = false
    visible: Boolean = false
  }

  enum StatusEnum {
    APPROVED
    NOT_APPROVED
  }
`;

module.exports = typeDefs;
