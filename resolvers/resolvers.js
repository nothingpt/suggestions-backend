const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Suggestion } = require("../schema/schema");
const { User } = require("../schema/user");

const resolvers = {
  Query: {
    numberOfSuggestions: async (parent, args, ctx, info) => {
      const count = await Suggestion.find().count();

      return count;
    },
    suggestions: async (parent, args, ctx, info) => {
      if (ctx.req.userId) {
        const offset = parseInt(args.offset);
        const limit = parseInt(args.limit);
        const res = await Suggestion.find({})
          .skip(offset * limit )
          .limit(limit)
          .exec();
        return res;
      } else {
        const res = await Suggestion.find({ visible: true });
        return res;
      }
    },
    suggestion: async (parent, { id }, ctx, info) => {
      const res = await Suggestion.findById(id);
      return res;
    },
    me: (parent, args, ctx, info) => {
      if (!ctx.req.userId) {
        return null;
      }

      const { userId } = ctx.req;
      const user = User.findById(userId);

      return user;
    },
    node: async (parent, { id }, ctx, info) => {
      const res = await Suggestion.findById(id);
      return res;
    }
  },
  Mutation: {
    addSuggestion: async (parent, args, ctx, info) => {
      try {
        const { title, suggestion } = args.input;

        const s = {
          title,
          suggestion
        };

        let response = Suggestion.create(s);
        return s;
      } catch (error) {
        return error;
      }
    },
    updateSuggestion: async (parent, args, ctx, info) => {
      const newSuggestion = { ...args };
      
      const status = newSuggestion.status;

      if (status === 'APPROVED') {
        newSuggestion.visible = true;
        newSuggestion.closed = true;
      } else {
        newSuggestion.visible = false;
        newSuggestion.closed = true;
      }

      const res = await Suggestion.findByIdAndUpdate(args.id, newSuggestion);

      return newSuggestion;
    },
    register: async (_, { email, password }) => {
      var userCreated = false;
      email = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ email, password: hashedPassword });

      return await newUser
        .save()
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    login: async (_, { email, password }, { req, res }) => {
      email = email.toLowerCase();

      const user = await User.findOne({ email: email });

      if (!user) {
        res.clearCookie("token");
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        res.clearCookie("token");
        return null;
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
      });

      return user;
    },
    signout: (parent, args, ctx, info) => {
      ctx.res.clearCookie("token");

      return { message: "Goodbye!" };
    }
  }
};

module.exports = resolvers;
