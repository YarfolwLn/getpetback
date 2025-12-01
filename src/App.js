/*import Main from './pages/main';
import Profile from './pages/profile';
import SearchPage from './pages/searchpage';
import Register from './pages/register';
import Addob from './pages/addob';

function App() {
  return (
    <div className='App'>
      <Main/>
      <Addob/>
    </div>
  );
}

export default App;
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import SearchPage from './pages/searchpage';
import Profile from './pages/profile';
import Register from './pages/register';
import Addob from './pages/addob';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add" element={<Addob />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;