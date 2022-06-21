const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.evqrs.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
    date: new Date()
  })

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}