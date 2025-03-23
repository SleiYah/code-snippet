import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from "../pages/SignUp"
import Login from "../pages/Login"
import Snippets from "../pages/Snippets"
import AddSnippet from "../pages/AddSnippet"
import EditSnippet from "../pages/EditSnippet"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login"/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/snippets" element={<Snippets />} />
          <Route path="/add-snippet" element={<AddSnippet />} />
          <Route path="/edit-snippet/:id" element={<EditSnippet />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
