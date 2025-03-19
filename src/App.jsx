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
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
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
        'loggedNoteappUser', JSON.stringify(user)
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
    localStorage.removeItem('loggedNoteappUser');
    setErrorMessage('close sesion');
    setTimeout(()=>{
      setErrorMessage(null)
    }, 5000);

    window.location.reload();

  }

 //creating new note
  const addNote = (event)=>{
    event.preventDefault();
    const noteObject ={
      content: newNote,
      important: Math.random() < 0.5,
      //id: notes.length + 1,
    }

    //Agregando nota a bd.json usando axios
    blogService
      .create(noteObject)
      .then(returnedNote =>{
        setBlogs(blogs.concat(returnedNote));
        setNewNotes('');
      });
      setErrorMessage('a create new Note..');
        setTimeout(()=>{
          setErrorMessage(null)
        },5000);
    
    console.log('Button clicked', event.target);
  };

  const handleNoteChange = (event)=>{
    console.log(event.target.value);
    setNewNotes(event.target.value);
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
        HandleNoteChange = {handleNoteChange} />
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