const Blog = ({ blog }) => (
  <div className="post">
   <p>
    {blog.title}
    <div className="sub-post">
      <span>likes: {blog.likes}</span>
      <span>url: {blog.url}</span>
      <span>Author: {blog.author}</span>
    </div>
   </p>
   
   
  </div>  
)

export default Blog