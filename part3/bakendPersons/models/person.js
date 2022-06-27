import mongoose from 'mongoose'

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