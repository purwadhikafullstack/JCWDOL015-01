import { useState } from "react";

interface FilterCriteria {
  name: string;
  age: string;
  expectedSalary: string;
  education: string;
}

interface ApplicantFilterProps {
  onFilter: (criteria: FilterCriteria) => void;
}

const ApplicantFilter: React.FC<ApplicantFilterProps> = ({ onFilter }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [education, setEducation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
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

export default ApplicantFilter;
