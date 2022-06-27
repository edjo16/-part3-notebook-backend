const personRouter = require('express').Router()
import Person from '../models/person'


personRouter.get('/', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})


personRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id).then(result => {
    response.json(result)
  })
})

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'The name or number is missing '
    })
  }
  Person.find({}).then(persons => {
    console.log('persons: ', persons)
    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
      .catch(error => next(error))
  })
})

personRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number
  }
  // Person.findByIdAndUpdate(request.params.id, person, { new: true,  runValidators: true, context: 'query' })
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

export default personRouter