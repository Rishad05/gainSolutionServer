const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Subject = require("./models/subject");
const Student = require("./models/student");

const app = express();

const port = process.env.PORT || 5000;
app.use(bodyParser.json());

app.use(
  "/graphql/",
  graphqlHTTP({
    schema: buildSchema(`
    
    type Subject {
        _id: ID!
        name: String!
      
    }

    type Student {
      _id: ID!
      name: String!
      email: String!
      password: String
      phone : String!
    }

    input SubjectInput {
        name: String!
       
    }

    input StudentInput{
      name: String!
      email: String!
      password: String!
      phone : String!
    }

    type RootQuery {
        subjects:[Subject!]!
        
    }

    type RootMutation {
        createSubject(subjectInput: SubjectInput): Subject
        createStudent(studentInput: StudentInput): Student
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

    `),
    rootValue: {
      subjects: () => {
        return Subject.find()
          .then((subjects) => {
            return subjects.map((subject) => {
              return { ...subject._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createSubject: (args) => {
        const subject = new Subject({
          name: args.subjectInput.name,
        });
        return subject
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createStudent: (args) => {
        return Student.findOne({email: args.studentInput.email}).then(student => {
          if (student){
            throw new Error('Student already exists');
          }
          return bcrypt
          .hash(args.studentInput.password, 12)
        })
        
          .then((hashedPassword) => {
            const student = new Student({
              name: args.studentInput.name,
              email: args.studentInput.email,
              password: hashedPassword,
              phone: args.studentInput.phone,
            });
            return student.save();
          })
          .then((result) => {
            return { ...result._doc, password:null };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);
mongoose
  .connect(
    `mongodb+srv://Rishad05:Cs2Ye83b@cluster0.j70me.mongodb.net/gainSolution?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connection successful with Database");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
