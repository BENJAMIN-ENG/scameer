import React, { useState, useEffect } from 'react'
import Button from './Button'
import axios from 'axios'

const Student = () => {
    const [regNumber, setRegNumber] = useState('')
    const [names, setNames] = useState('')
    const [age, setAge] = useState('')

    const [programmes, setProgrammes] = useState([])
    const [faculties, setFaculties] = useState([])
    const [departments, setDepartments] = useState([])

    const [selectedProgrammeId, setSelectedProgrammeId] = useState('')
    const [selectedFacultyId, setSelectedFacultyId] = useState('')
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('')

    useEffect(() => {
        axios.get("http://localhost:5000/api/academicUnit/byType/PROGRAMME")
            .then((response) => {
                setProgrammes(response.data)
            })
            .catch((error) => {
                console.error("Error fetching programmes:", error)
            })
    }, [])

    useEffect(() => {
        if (selectedProgrammeId) {
            const selectedProgramme = programmes.find(p => p.id === selectedProgrammeId)
            if (selectedProgramme) {
                axios.get(`http://localhost:5000/api/academicUnit/facultiesByProgramme/${selectedProgramme.code}`)
                    .then((response) => {
                        setFaculties(response.data)
                        setDepartments([]) // Clear departments when programme changes
                        setSelectedFacultyId('')
                        setSelectedDepartmentId('')
                    })
                    .catch((error) => {
                        console.error("Error fetching faculties:", error)
                        setFaculties([])
                    })
            }
        } else {
            setFaculties([])
            setDepartments([])
        }
    }, [selectedProgrammeId, programmes])

    useEffect(() => {
        if (selectedFacultyId) {
            const selectedFaculty = faculties.find(f => f.id === selectedFacultyId)
            if (selectedFaculty) {
                axios.get(`http://localhost:5000/api/academicUnit/departmentsByFaculty/${selectedFaculty.code}`)
                    .then((response) => {
                        setDepartments(response.data)
                        setSelectedDepartmentId('')
                    })
                    .catch((error) => {
                        console.error("Error fetching departments:", error)
                        setDepartments([])
                    })
            }
        } else {
            setDepartments([])
        }
    }, [selectedFacultyId, faculties])

    const saveStudent = () => {
        if (!selectedDepartmentId) {
            alert("Please select a department")
            return
        }

        const studentData = {
            regNumber: regNumber,
            names: names,
            age: parseInt(age),
            department: {
                id: selectedDepartmentId
            }
        }

        axios.post("http://localhost:5000/api/students", studentData)
            .then((response) => {
                alert("Student saved successfully: " + response.data)
                setRegNumber('')
                setNames('')
                setAge('')
                setSelectedProgrammeId('')
                setSelectedFacultyId('')
                setSelectedDepartmentId('')
            })
            .catch((error) => {
                console.error("Error saving student:", error)
                alert("There was an error saving the student: " + error.message)
            })
    }

    return (
        <div>
            <h2>Register Student</h2>
            <div>
                <label>Registration Number</label>
                <input
                    type="text"
                    value={regNumber}
                    required
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder='Enter Registration Number' />
            </div>

            <div>
                <label>Names</label>
                <input
                    type="text"
                    value={names}
                    required
                    onChange={(e) => setNames(e.target.value)}
                    placeholder='Enter Names' />
            </div>

            <div>
                <label>Age</label>
                <input
                    type="number"
                    value={age}
                    required
                    onChange={(e) => setAge(e.target.value)}
                    placeholder='Enter Age' />
            </div>

            <div>
                <label>Programme</label>
                <select value={selectedProgrammeId} onChange={(e) => setSelectedProgrammeId(e.target.value)}>
                    <option value="">Select Programme</option>
                    {programmes.map((prog) => (
                        <option key={prog.id} value={prog.id}>
                            {prog.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedProgrammeId && (
                <div>
                    <label>Faculty</label>
                    <select value={selectedFacultyId} onChange={(e) => setSelectedFacultyId(e.target.value)}>
                        <option value="">Select Faculty</option>
                        {faculties.map((fac) => (
                            <option key={fac.id} value={fac.id}>
                                {fac.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedFacultyId && (
                <div>
                    <label>Department</label>
                    <select value={selectedDepartmentId} onChange={(e) => setSelectedDepartmentId(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <Button label="Save Student" changeParameter={saveStudent} />
            </div>
        </div>
    )
}

export default Student
