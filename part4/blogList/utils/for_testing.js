
const reverse = (string) => {
    return string
      .split('')
      .reverse()
      .join('')
  }
  
  const average = (array) => {
    const reducer = (sum, item) => {
      return sum + item
    }
  
    return array.reduce(reducer, 0) / array.length
  }
  

  const sum =(a,b)=>{
    return a+b
  }
 module.exports={
    reverse,
    average,
    sum
  }
