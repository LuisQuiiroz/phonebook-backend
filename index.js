const express = require('express')
const morgan = require('morgan')

const app = express()

let persons = [
    {
        name: "Luis Perez",
        number: "33-11-55-99-33",
        id: 1
    },
    {
        name: "Ivonne Garcia",
        number: "33-22-66-00-44",
        id: 2
    },
    {
        name: "Paola Lopez",
        number: "33-33-77-11-55",
        id: 3
    },
    {
        name: "Gaby Gomez",
        number: "33-33-77-11-55",
        id: 4
    },
    {
        name: "Carlos Gutierrez",
        number: "33-33-77-11-55",
        id: 5
    }
]
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())//json-parser
// Sin json-parser, la propiedad body no estaría definida. El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto request antes de llamar al controlador de ruta.

// middleware con información de la request
app.use(requestLogger)

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const countPersons = persons.length
    const info = `
        Phonebook has info for ${countPersons} people 
        <br> 
        ${new Date()}`
    response.send(info)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// este middleware se usa para capturar solicitudes realizadas a rutas inexistentes.
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})