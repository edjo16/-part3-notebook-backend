
import express, { json } from "express"
import morgan from "morgan"
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware';
const app= express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => console.log(JSON.stringify(req.body)));



let persons =[
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

app.get('/api/persons',(request, response)=>{
        response.json(persons)
})
app.get('/api/info',(request, response)=>{
    const entrys= persons.length
    response.send(`<div>
    <h3>Notebook has info for ${entrys} people</h3>
    <h3>${new Date()}</h3>
    </div>`)

})
app.get('/api/persons/:id',(request, response)=>{
 const id= parseInt(request.params.id)
 const thisnotebook= persons.find(person => person.id === id)
thisnotebook? response.json(thisnotebook): response.status(404).end()
})

app.delete('/api/persons/:id',(request, response)=>{
    const id= parseInt(request.params.id)
    persons =persons.filter(person => person.id !== id )
    response.status(204).end()    
})


app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.post('/api/persons',(request, response)=>{
 const body= request.body

 if(!body.name || !body.number ){
    return response.status(404).json({
        error: 'The name or number is missing '
    })
}
else if(persons.find(person => person.name === body.name )){
        return response.status(404).json({
            error:  'name must be unique'
        })
 }
    const note = {
        name: body.name,
        number: body.number,
       id: Math.floor(Math.random() *1000)
    }
    persons = persons.concat(note)
    response.json(note)
})
 
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  })
);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})