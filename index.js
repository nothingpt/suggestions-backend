const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

mongoose.Promise = global.Promise;
const resolvers = require("./resolvers/resolvers");
const typeDefs = require("./typedefs/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token,  process.env.JWT_SECRET);
    // console.log(userId);
    req.userId = userId;
  }

  next();
})

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  enablePreflight: true
}));

app.use(
  session({
    secret: "2wsx1qaz",
    resave: false,
    saveUninitialized: false
  })
);

const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// ('Access-Control-Allow-Origin: *');
mongoose.connect(url, { useNewUrlParser: true });
mongoose.connection.once("open", () =>
  console.log(`Connected to mongo at ${url}`)
);

server.applyMiddleware({
  app,
  cors: false
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
