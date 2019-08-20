const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')


const app = express()

app.use(bodyParser.json())

/* Need schema and rootValue
* schema is jus the definition of the endpoint
* rootValue has the functions to handle the end points
*/
const events = []
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventIntput {
            title: String!
            description: String!
            price: String!
            date: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventIntput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events
        },
        //args is an array of values sent from the api endpoint.
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date).toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: true

}))

app.listen(3000, console.log("App is running on port 3000..."))