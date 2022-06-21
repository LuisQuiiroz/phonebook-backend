require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') // mongoose
const handleErrors = require('./middleware/handleErrors')
const unknownEndpoint = require('./middleware/unknownEndpoint')

const app = express()

// cors
app.use(cors())

//express
app.use(express.static('dist')) // lee lo que se encuentra en la carpeta dist(la parte del Frontend)

app.use(express.json())//json-parser
// Sin json-parser, la propiedad body no estaría definida. El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto request antes de llamar al controlador de ruta.

// morgan
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(400).send({ error: 'id does not exist' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
  // if (!body.name) {
  //     return response.status(400).json({ error: 'name missing' })
  // }
  // if (!body.number) {
  //     return response.status(400).json({ error: 'number missing' })
  // }
  // Person.find({ name: body.name }).then(result => {
  //     console.log(result)
  //     if (result.length > 0) {
  //         next() // put
  //     } else {
  //         console.log('new person')
  //         const person = new Person({
  //             name: body.name,
  //             number: body.number,
  //             date: new Date()
  //         })
  //         person.save()
  //             .then(savedPerson => {
  //                 response.json(savedPerson)
  //             })
  //             .catch(error => console.log('error', error))
  //     }
  // })
  //     .catch(error => console.log('error', error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const body = request.body
  console.log('same name, updating')
  const newPersonInfo = {
    number: body.number,
    date: new Date()
  }
  Person.findByIdAndUpdate(id, newPersonInfo, { new: true, runValidators: true })
    // new: true    devuelve la información del objeto actualizado, si estuviera en falso, devuelve el objeto encontrado en la base de datos
    // runValidators: true  hace que se vuelvan a validar los requisitos del campo
    .then(personUpdate => {
      response.json(personUpdate)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const countPersons = persons.length
      const info = `
            Phonebook has info for ${countPersons} people 
            <br> 
            ${new Date()}`
      response.send(info)
    })
    .catch(error => next(error))
})

// este middleware se usa para capturar solicitudes realizadas a rutas inexistentes.
app.use(unknownEndpoint)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})