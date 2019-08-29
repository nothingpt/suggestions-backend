const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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
    const { userId } = jwt.verify(token,  'jwtsecret123');
    // console.log(userId);
    req.userId = userId;
  }

  next();
})

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  enablePreflight: true
}));

app.use((req, res, next) => {
  // console.log(req.headers);
  next()
})

app.use(
  session({
    secret: "2wsx1qaz",
    resave: false,
    saveUninitialized: false
  })
);

const url = "mongodb://localhost:27017/suggestionsDB";
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
