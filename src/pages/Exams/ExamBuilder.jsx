import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const ExamBuilder = () => {
  const [exam, setExam] = useState({
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

  const handleSaveExam = () => {
    console.log("Exam saved:", { exam, questions });
    alert("Exam saved successfully!");
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

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const [previewAnswers, setPreviewAnswers] = useState({});

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
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Exam Builder</h1>
          <div>
            <button className="custom-btn" onClick={handlePreview} style={{ marginRight: "0.5rem" }}>
              👁️ Preview Exam
            </button>
            <button className="custom-btn" onClick={handleSaveExam}>
              💾 Save Exam
            </button>
          </div>
        </div>

        {/* Exam Basic Info */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Exam Information</h2>
          <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
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
                <input
                  type="number"
                  name="duration"
                  placeholder="60"
                  value={exam.duration}
                  onChange={handleExamChange}
                />
              </div>
              <div className="form-input">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  name="passingScore"
                  placeholder="70"
                  value={exam.passingScore}
                  onChange={handleExamChange}
                />
              </div>
            </div>
            <div className="form-input">
              <label>Total Questions: {questions.length}</label>
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
            <p style={{ color: "#666" }}>No questions added yet. Click "Add Question" to get started.</p>
          ) : (
            <Table
              headers={["#", "Question", "Options", "Correct Answer", "Actions"]}
              rows={questions.map((q) => [
                q.questionNumber,
                q.question.substring(0, 50) + "...",
                q.options.join(", ").substring(0, 60) + "...",
                q.options[q.correctAnswer],
                <>
                  <button className="edit-btn" onClick={() => handleEditQuestion(q)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteQuestion(q.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </button>
                </>,
              ])}
            />
          )}
        </div>

        {/* Add/Edit Question Modal */}
        {showQuestionModal && (
          <Modal onClose={() => setShowQuestionModal(false)}>
            <div className="modal-header">
              <h2>{currentQuestion ? "Edit Question" : "Add Question"}</h2>
              <button className="modal-close" onClick={() => setShowQuestionModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-input">
                <label>Question</label>
                <textarea
                  placeholder="Enter your question..."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-input">
                <label>Options</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <label style={{ marginLeft: "0.5rem" }}>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correctAnswer === index}
                        onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
              <div className="form-input">
                <label>Explanation</label>
                <textarea
                  placeholder="Explanation for the correct answer..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  rows="3"
                />
              </div>
              <button className="custom-btn" onClick={handleAddQuestion}>
                {currentQuestion ? "Update Question" : "Add Question"}
              </button>
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
                <p>No questions to preview. Add questions first.</p>
              ) : (
                <>
                  <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f0f8f1", borderRadius: "8px" }}>
                    <p><strong>Duration:</strong> {exam.duration} minutes</p>
                    <p><strong>Total Questions:</strong> {questions.length}</p>
                    <p><strong>Passing Score:</strong> {exam.passingScore}%</p>
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
                            {optIndex === q.correctAnswer && (
                              <span style={{ marginLeft: "0.5rem", color: "#059669", fontWeight: "bold" }}>
                                ✓ Correct
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                      {q.explanation && (
                        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#fef3c7", borderRadius: "4px" }}>
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{ marginTop: "2rem", padding: "1rem", background: "#d9f0e6", borderRadius: "8px", textAlign: "center" }}>
                    <h3>Preview Score</h3>
                    <p>
                      {calculatePreviewScore().correct} / {calculatePreviewScore().total} correct (
                      {calculatePreviewScore().percentage}%)
                    </p>
                    <p>
                      {calculatePreviewScore().percentage >= exam.passingScore ? (
                        <span style={{ color: "#059669", fontWeight: "bold" }}>✓ Pass</span>
                      ) : (
                        <span style={{ color: "#dc2626", fontWeight: "bold" }}>✗ Fail</span>
                      )}
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
