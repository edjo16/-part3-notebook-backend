const dummy = (blogs) => {

    return blogs? 1 :0
}
  
const totalLikes= (array)=>{
const total= array.map(data=> data.likes).reduce((prev, next)=>{
    return prev+=next
 })
 return total
}
  
const favoriteBlog = (array)=>{
  const max= Math.max(...array.map(data=> data.likes))
    const datafavorite= array.find(data => data.likes === max && data )

   return datafavorite
  }

    
const mostBlogs = (array)=>{
  
  const authorblogs= array.reduce((op, {author})  =>{
    op[author]= op[author] || 0
    op[author] += 1
    return op
  },{})

  return authorblogs
  }

  const mostLiked = (array)=>{
    const {getOwnPropertyNames, values}= Object
    let authorLikes = array.reduce((op, { author, likes }) => {
      op[author] = op[author] || 0;
     op[author] += likes
      return op;
    }, {});
    const data = {
      name: getOwnPropertyNames(authorLikes)[0],
      likes: values(authorLikes)[0]
    };
    return data
  }

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLiked
  }