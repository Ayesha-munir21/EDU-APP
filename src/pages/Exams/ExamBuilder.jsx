import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const ExamBuilder = () => {
  const [exam, setExam] = useState({title:"", questionCount:5, duration:60});
  const [questions, setQuestions] = useState([
    {Question:"What is VPC?", Options:"Option1,Option2", Correct:"Option1"}
  ]);

  const handleChange = e => setExam({...exam, [e.target.name]: e.target.value});

  const handleSaveExam = () => {
    console.log("Exam saved:", exam, questions);
    alert("Exam saved (mock)!");
  }

  const columns = ["Question", "Options", "Correct"];
  
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div style={{flex:1, padding:"2rem"}}>
        <h1>Exam Builder</h1>
        <div style={{marginTop:"1rem", marginBottom:"2rem", display:"grid", gap:"1rem", maxWidth:"500px"}}>
          <input type="text" name="title" placeholder="Exam Title" value={exam.title} onChange={handleChange} />
          <input type="number" name="questionCount" placeholder="Question Count" value={exam.questionCount} onChange={handleChange} />
          <input type="number" name="duration" placeholder="Duration (minutes)" value={exam.duration} onChange={handleChange} />
          <button onClick={handleSaveExam}>Save Exam</button>
        </div>

        <h2>Questions</h2>
        <Table columns={columns} data={questions} />
      </div>
    </div>
  )
}

export default ExamBuilder;
