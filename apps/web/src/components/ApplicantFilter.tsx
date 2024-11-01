import { useState } from "react";

// components/ApplicantFilter.tsx
const ApplicantFilter = ({ onFilter }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [expectedSalary, setExpectedSalary] = useState('');
    const [education, setEducation] = useState('');
  
    const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      onFilter({ name, age, expectedSalary, education });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
        <input type="number" placeholder="Expected Salary" onChange={(e) => setExpectedSalary(e.target.value)} />
        <input type="text" placeholder="Education" onChange={(e) => setEducation(e.target.value)} />
        <button type="submit">Filter</button>
      </form>
    );
  };
  