
import express, { json, request } from "express"
import morgan from "morgan"
import cors from 'cors'
import Person from './models/person.js'
import 'dotenv/config'
const app= express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


// create custome message in the middleweare s
morgan.token('ob', function (req) {
  return `${JSON.stringify(req.body)}`
})
app.use(morgan(':method :url :status :response-time :req[header] :ob'))

app.get('/api/people',(request, response)=>{
  Person.find({}).then(person =>{
    response.json(person)
  })})

app.get('/api/info',(request, response)=>{
    const entrys= Person.length
    response.send(`<div>
    <h3>Notebook has info for ${entrys} people</h3>
    <h3>${new Date()}</h3>
    </div>`)

})
app.get('/api/people/:id',(request, response)=>{
  Person.findById(request.params.id).then(result =>{
   response.json(result)
 })
})

app.delete('/api/people/:id',(request, response)=>{
       
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
    // const id= parseInt(request.params.id)
    //     Person =Person.filter(person => person.id !== id )
    //     response.status(204).end() 
  })




app.post('/api/people',(request, response, next)=>{
 const body= request.body

 if(!body.name || !body.number ){
    return response.status(404).json({
        error: 'The name or number is missing '
    })
}
Person.find({}).then(persons => {
  console.log('persons: ', persons)

  if (persons.some(person => person.name === body.name)) {
      console.log("name must be unique")
      return response.status(400).json({
          error: 'name must be unique'
      })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
})
    person.save().then(savedPerson =>{
      response.json(savedPerson)
    })
    .catch(error => next(error))
})
})

app.put('/api/people/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true,  runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    return response.status(400).json({ error: error.message })  }

  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})