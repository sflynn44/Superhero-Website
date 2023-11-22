import './App.css';
import Base from "./components/basePage";
import Login from "./components/login"; 
import UpdatePass from "./components/updatePass"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Base />}/>
          <Route path="/login" element = {<Login />}/>
          <Route path="/updateP" element={<UpdatePass />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
