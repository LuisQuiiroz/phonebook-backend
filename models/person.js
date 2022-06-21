const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'More than 3 characters, got {VALUE}'],
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: [10, 'Must have 10 numbers, got {VALUE}'],
    required: true
  },
  date: Date,
})
personSchema.plugin(uniqueValidator)

//  formatea los objetos devueltos por Mongoose
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Ejemplo de como queda el esquema
// {
//     name: String,
//     number: String,
//     date: Date,
//     id: String
// }


module.exports = mongoose.model('Person', personSchema)