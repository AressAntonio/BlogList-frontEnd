import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Notification from './components/Notification'

const App = () => {

  //controlador de publicaciones
  const [blogs, setBlogs] = useState([])

  //controlador newNote
  const [newNote, setNewNotes] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  //controlador de notificaciones
  const [errorMessage, setErrorMessage] = useState('¡Hola!', setTimeout(() => {
    setErrorMessage(null);
  }, 5000));
 
  //controlador inicio-sesion
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //controlador users
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, []);


  //controlador-eventos-login
  const handleLogin = async (event) =>{
    event.preventDefault();
    console.log(`logging in with ${username}, ${password}`);

    try{
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      
    } catch (exception){
      console.log(exception);
      setErrorMessage('Wrong credentials');

      setTimeout(()=>{
        setErrorMessage(null)
      }, 5000)
    }
  };

  const handleLogout = ()=>{
    //eliminando token
    localStorage.removeItem('loggedBlogAppUser');
    setErrorMessage('close sesion');
    setTimeout(()=>{
      setErrorMessage(null)
    }, 5000);

    window.location.reload();

  }

 //creating new blog
  const addNote = (event)=>{
    event.preventDefault();
    const noteObject ={
      title: newNote,
      author: newAuthor,
      url: newUrl,
      likes: Math.floor(Math.random()*2000)
    }

    //Agregando blog a db usando axios
    blogService
      .create(noteObject)
      .then(returnedBlog =>{
        setBlogs(blogs.concat(returnedBlog));
        setNewNotes('');
        setNewAuthor('');
        setNewUrl('');
      })
      .catch(() =>{
        setErrorMessage('Algo salio mal');
        setTimeout(()=>{
          setErrorMessage(null)
        },5000);
      });

      setErrorMessage('a create new Post..');
        setTimeout(()=>{
          setErrorMessage(null)
        },5000);
    
    console.log('Button clicked', event.target);
  };

//controlador de eventos
  const handleNoteChange = (event)=>{
    console.log(event.target.value);
    setNewNotes(event.target.value);
  };

  const handleAuthorChange = (event) =>{
    console.log(event.target.value);
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) =>{
    console.log(event.target.value);
    setNewUrl(event.target.value);
  };



  return (
    <div>
      <h1><strong>Blogs</strong></h1>
      <Notification message={errorMessage} />

      {user === null ?
      <div className='logIn'>
        <h2>Log in to application</h2>
         <LoginForm
           password = {password}
           handleLogin = {handleLogin}
           setUsername = {setUsername}
           setPassword = {setPassword} />
      </div> :
      
      <div>
        <p>{user.name} logged-in <button onClick={handleLogout} className='btn-logout'>logOut</button></p>
        <NoteForm addNote = {addNote} 
         newNote = {newNote} 
         newAuthor = {newAuthor}
         newUrl = {newUrl}
         HandleNoteChange = {handleNoteChange}
         HandleAuthorChange = {handleAuthorChange}
         HandleUrlChange = {handleUrlChange}
         />
        <h2><strong>Posts</strong></h2>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
      </div>

      

      }
      
    </div>
  )
}

export default App