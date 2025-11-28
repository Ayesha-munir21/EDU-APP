import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";

const API_BASE_URL = "https://ceretification-app.onrender.com";

const ExamBuilder = () => {
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [exam, setExam] = useState({
    trackId: "",
    title: "",
    description: "",
    duration: 60,
    passingScore: 70,
    questionCount: 0,
  });

  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExam({ ...exam, [name]: value });
  };

  const handleSaveExam = async () => {
    if (!exam.trackId) {
        error("Please enter a Track ID");
        return;
    }
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
        const examPayload = {
            title: exam.title,
            passing_score: parseInt(exam.passingScore),
            time_limit_minutes: parseInt(exam.duration),
            question_count: questions.length,
            metadata: { description: exam.description }
        };

        const res1 = await fetch(`${API_BASE_URL}/api/admin/tracks/${exam.trackId}/manual-exam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(examPayload)
        });

        if (!res1.ok) throw new Error("Failed to create exam metadata. Check Track ID.");
        const examData = await res1.json();
        const examId = examData._id;

        const questionsPayload = questions.map(q => ({
            question: q.question,
            options: q.options,
            correct_answer: q.options[q.correctAnswer],
            correctAnswers: [q.correctAnswer.toString()],
            explanation: q.explanation
        }));

        const res2 = await fetch(`${API_BASE_URL}/api/admin/exams/${examId}/questions/bulk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(questionsPayload)
        });

        if (!res2.ok) throw new Error("Failed to save questions.");

        success(`Exam created with ${questions.length} questions!`);
        setQuestions([]);
        setExam({ ...exam, title: "", description: "" });

    } catch (err) {
        console.error(err);
        error(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const question = {
      id: currentQuestion?.id || Date.now(),
      ...newQuestion,
      questionNumber: currentQuestion ? currentQuestion.questionNumber : questions.length + 1,
    };
    
    if (currentQuestion) {
      setQuestions(questions.map((q) => (q.id === currentQuestion.id ? question : q)));
    } else {
      setQuestions([...questions, question]);
    }
    
    setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
    setCurrentQuestion(null);
    setShowQuestionModal(false);
    setExam({ ...exam, questionCount: questions.length + (currentQuestion ? 0 : 1) });
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setNewQuestion({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
    });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== id));
      setExam({ ...exam, questionCount: exam.questionCount - 1 });
    }
  };

  // ✅ FIX: This function is now properly used in the JSX below
  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  // Preview Logic
  const [previewAnswers, setPreviewAnswers] = useState({});
  
  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePreviewAnswer = (questionId, answerIndex) => {
    setPreviewAnswers({ ...previewAnswers, [questionId]: answerIndex });
  };

  const calculatePreviewScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (previewAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Exam Builder</h1>
          <div>
            <button className="custom-btn" onClick={handlePreview} style={{ marginRight: "0.5rem" }}>
              👁️ Preview Exam
            </button>
            <button className="custom-btn" onClick={handleSaveExam} disabled={loading}>
              {loading ? "Saving..." : "💾 Save Exam"}
            </button>
          </div>
        </div>

        {/* Exam Basic Info */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Exam Information</h2>
          <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
            <div className="form-input">
              <label>Track ID (Required)</label>
              <input
                type="text"
                name="trackId"
                placeholder="e.g. AWS-CCP"
                value={exam.trackId}
                onChange={handleExamChange}
              />
            </div>
            <div className="form-input">
              <label>Exam Title</label>
              <input
                type="text"
                name="title"
                placeholder="Exam Title"
                value={exam.title}
                onChange={handleExamChange}
              />
            </div>
            <div className="form-input">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Exam Description"
                value={exam.description}
                onChange={handleExamChange}
                rows="3"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-input">
                <label>Duration (minutes)</label>
                <input type="number" name="duration" value={exam.duration} onChange={handleExamChange} />
              </div>
              <div className="form-input">
                <label>Passing Score (%)</label>
                <input type="number" name="passingScore" value={exam.passingScore} onChange={handleExamChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="custom-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Questions ({questions.length})</h2>
            <button className="custom-btn" onClick={() => {
              setCurrentQuestion(null);
              setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
              setShowQuestionModal(true);
            }}>
              ➕ Add Question
            </button>
          </div>

          {questions.length === 0 ? (
             <p style={{ color: "#666" }}>No questions added yet.</p>
          ) : (
             <Table
              headers={["#", "Question", "Correct Answer", "Actions"]}
              rows={questions.map((q) => [
                q.questionNumber,
                q.question.substring(0, 50) + "...",
                q.options[q.correctAnswer],
                <>
                   <button className="edit-btn" onClick={() => handleEditQuestion(q)}>Edit</button>
                   <button className="delete-btn" onClick={() => handleDeleteQuestion(q.id)} style={{marginLeft:'0.5rem'}}>Delete</button>
                </>,
              ])}
            />
          )}
        </div>

        {/* Question Modal */}
        {showQuestionModal && (
          <Modal onClose={() => setShowQuestionModal(false)}>
             <div className="modal-header"><h2>{currentQuestion ? "Edit" : "Add"} Question</h2><button onClick={()=>setShowQuestionModal(false)}>x</button></div>
             <div className="modal-body">
                <div className="form-input">
                    <label>Question</label>
                    <textarea value={newQuestion.question} onChange={(e)=>setNewQuestion({...newQuestion, question:e.target.value})} rows="3"/>
                </div>
                <div className="form-input">
                    <label>Options (Select Correct)</label>
                    {newQuestion.options.map((opt, i) => (
                        <div key={i} style={{display:'flex', gap:'10px', marginBottom:'5px'}}>
                            {/* ✅ FIX: Using the function here instead of inline logic */}
                            <input 
                                type="text" 
                                value={opt} 
                                onChange={(e) => handleOptionChange(i, e.target.value)} 
                                placeholder={`Option ${i+1}`} 
                                style={{flex:1}}
                            />
                            <label><input type="radio" name="correct" checked={newQuestion.correctAnswer === i} onChange={()=>setNewQuestion({...newQuestion, correctAnswer: i})} /> Correct</label>
                        </div>
                    ))}
                </div>
                <div className="form-input">
                 <label>Explanation</label>
                 <textarea value={newQuestion.explanation} onChange={(e)=>setNewQuestion({...newQuestion, explanation:e.target.value})} rows="2"/>
               </div>
                <button className="custom-btn" onClick={handleAddQuestion}>{currentQuestion ? "Update" : "Add"}</button>
             </div>
          </Modal>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <Modal onClose={() => setShowPreview(false)}>
            <div className="modal-header">
              <h2>Exam Preview: {exam.title}</h2>
              <button className="modal-close" onClick={() => setShowPreview(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {questions.length === 0 ? (
                <p>No questions to preview.</p>
              ) : (
                <>
                  <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f0f8f1", borderRadius: "8px" }}>
                    <p><strong>Duration:</strong> {exam.duration} minutes</p>
                    <p><strong>Total Questions:</strong> {questions.length}</p>
                  </div>
                  {questions.map((q, index) => (
                    <div key={q.id} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
                      <h3>Question {index + 1}</h3>
                      <p style={{ marginBottom: "1rem" }}>{q.question}</p>
                      <div>
                        {q.options.map((option, optIndex) => (
                          <label
                            key={optIndex}
                            style={{
                              display: "block",
                              padding: "0.5rem",
                              marginBottom: "0.5rem",
                              background: previewAnswers[q.id] === optIndex ? "#d9f0e6" : "#f9fafb",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={previewAnswers[q.id] === optIndex}
                              onChange={() => handlePreviewAnswer(q.id, optIndex)}
                              style={{ marginRight: "0.5rem" }}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: "2rem", padding: "1rem", background: "#d9f0e6", borderRadius: "8px", textAlign: "center" }}>
                    <h3>Preview Score</h3>
                    <p>
                      {calculatePreviewScore().correct} / {calculatePreviewScore().total} correct
                    </p>
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ExamBuilder;