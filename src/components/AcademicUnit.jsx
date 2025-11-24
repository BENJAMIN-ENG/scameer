import React, { useState, useEffect } from 'react'
import Button from './Button'
import axios from 'axios'

const AcademicUnit = () => {

    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [type, setType] = useState('')
    const [programmes, setProgrammes] = useState([])
    const [faculties, setFaculties] = useState([])
    const [selectedProgrammeId, setSelectedProgrammeId] = useState('')
    const [selectedFacultyId, setSelectedFacultyId] = useState('')

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
        if (type === 'DEPARTMENT' && selectedProgrammeId) {
            const selectedProgramme = programmes.find(p => p.id === selectedProgrammeId)
            if (selectedProgramme) {
                axios.get(`http://localhost:5000/api/academicUnit/facultiesByProgramme/${selectedProgramme.code}`)
                    .then((response) => {
                        setFaculties(response.data)
                    })
                    .catch((error) => {
                        console.error("Error fetching faculties:", error)
                        setFaculties([])
                    })
            }
        } else {
            setFaculties([])
        }
    }, [type, selectedProgrammeId, programmes])

    const saveAcademicUnit = () => {
        let parent = null;
        if (type === 'FACULTY') {
            parent = { id: selectedProgrammeId }
        } else if (type === 'DEPARTMENT') {
            parent = { id: selectedFacultyId }
        }

        axios.post("http://localhost:5000/api/academicUnit/save", {
            name: name,
            code: code,
            type: type,
            parent: parent
        }).then((response) => {
            alert("Academic Unit saved successfull " + response.data)
        }).catch((error) => {
            alert("There was an error saving the academic unit " + error)
        })
        setName('')
        setCode('')
        setType('')
        setSelectedProgrammeId('')
        setSelectedFacultyId('')
    }

    return (
        <div>
            <div>
                <label>Academic Unit Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter the Academic unit Name' />
            </div>

            <div>
                <label>Academic Unit Code</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder='Enter the Academic unit Code' />
            </div>

            <div>
                <label>Academic Unit Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Select Unit Type</option>
                    <option value="PROGRAMME">PROGRAMME</option>
                    <option value="FACULTY">FACULTY</option>
                    <option value="DEPARTMENT">DEPARTMENT</option>
                </select>
            </div>

            {(type === 'FACULTY' || type === 'DEPARTMENT') && (
                <div>
                    <label>Parent Programme</label>
                    <select value={selectedProgrammeId} onChange={(e) => setSelectedProgrammeId(e.target.value)}>
                        <option value="">Select Parent Programme</option>
                        {programmes.map((prog) => (
                            <option key={prog.id} value={prog.id}>
                                {prog.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {type === 'DEPARTMENT' && selectedProgrammeId && (
                <div>
                    <label>Parent Faculty</label>
                    <select value={selectedFacultyId} onChange={(e) => setSelectedFacultyId(e.target.value)}>
                        <option value="">Select Parent Faculty</option>
                        {faculties.map((fac) => (
                            <option key={fac.id} value={fac.id}>
                                {fac.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div>
                <Button label="Save Academeic unit" changeParameter={saveAcademicUnit} />
            </div>
        </div>
    )
}

export default AcademicUnit

