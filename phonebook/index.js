const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if(note) {
    response.json(note)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)  
    console.log(notes)
})

app.post('/api/persons', (request, response) => {
    const generateId = () => {
        const id = Math.floor(Math.random() * 10000)
        return id
    }
    
    const person = {
      name: request.body.name,
      number: request.body.number || '',
      id: generateId(),
    
    }
    if(!person.name || !person.number) {
     return response.status(400).json({
        error: 'Please fill both name and number fields'
      })
    }

    if(notes.find(note => note.name === person.name)) {
      return response.status(400).json({
        error: 'Name must be unique'
      })
    }

      notes = notes.concat(person)
      console.log(notes)
      response.json(person)
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${notes.length} people</p> 
    <p>${new Date()}</p>`) 

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})