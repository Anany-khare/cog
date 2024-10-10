// import Signup from './components/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import LandingPage from './components/LandingPage'
import ChatPage from './components/ChatPage'
import HomePage from './components/HomePage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path='/signup' element={<Signup/>}></Route> */}
      <Route path='/auth' element={<Auth/>}></Route>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/HomePage' element={<HomePage/>}></Route>
      <Route path='/chat' element={<ChatPage/>}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App
