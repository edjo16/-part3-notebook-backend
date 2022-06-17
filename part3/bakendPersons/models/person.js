import mongoose from 'mongoose'
import 'dotenv/config'

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => { console.log('connected to MongoDB') })
  .catch((error) => { console.log('error connecting to MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
  name: {
    minlength: 3,
    type: String,
    required: true
  },
  number: {
    minlength: 8,
    type: String,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


export default mongoose.model('person', personSchema)