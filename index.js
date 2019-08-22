const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()


const dbService = require('./dbUtil/dbService')
const EventService = new dbService('Events')
const Events = require('./models/eventsModel')
const User = require('./models/userModel')

const app = express()
var getEvents = async () => {
    EventService.getRecord({}, {}, {}, (err, data) => {
        if (err) return err
        delete data[0].__v
        return data[0]
        // return data.map(event => {
        //     delete event.__v
        //     console.log(event)
        //     return { ...event }
        // })
    })
}
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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventIntput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Events.find().then(events => {
                return events.map(event => {
                    return { ...event._doc, _id: event.id }
                })
            }).catch(err => {
                throw err
            })

        },
        //args is an array of values sent from the api endpoint.
        createEvent: (args) => {
            const event = {
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date).toISOString()
            }

            EventService.createRecord(event, (err, data) => {
                if (err) return err

                delete data.__v
                return data
            })
            return event
        },
        createUser: (args) => {
            return bcrypt
                .hash(args.userInput.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    })
                    return user.save()

                })
                .then(result => {
                    return { ...result._doc, password: null, _id: result.id }
                })
                .catch(err => {
                    throw err
                })


        }
    },
    graphiql: true

}))

mongoose.connect((`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`), { useNewUrlParser: true }, (err) => {
    if (err) { console.log(err) }
    else {
        app.listen(3000, console.log("App is running on port 3000..."))
    }



})