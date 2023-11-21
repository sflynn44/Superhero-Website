import './App.css';
import Base from "./components/basePage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Base />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
