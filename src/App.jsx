import './App.css'
import AcademicUnit from './components/AcademicUnit'
import Student from './components/Student'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {

  return (
    <Router>
      <div className="app-container">
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '20px' }}>Academic Units</Link>
          <Link to="/student">Register Student</Link>
        </nav>

        <Routes>
          <Route path="/" element={<AcademicUnit />} />
          <Route path="/student" element={<Student />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
