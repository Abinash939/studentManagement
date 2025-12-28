import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Student {
  rollNo?: number;
  name: string;
  percentage: number | "";
  branch: string;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);

  const [showPopup, setShowPopup] = useState(false);
    const [dltPopup, setDltPopup] = useState(false);

  const [showPopupView, setShowPopupView] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [studentDetails, setStudentDetails] = useState<Student | null>(null);

  // const [showEditPopup, setShowEditPopup] = useState(false);
  const [originalStudent, setOriginalStudent] = useState<Student | null>(null);
  // const [editedStudent, setEditedStudent] = useState<Student | null>(null);

  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");

  const emptyStudent: Student = {

    name: "",
    percentage: "",
    branch: ""
  };
  const [studentForm, setStudentForm] = useState<Student>(emptyStudent);

const fetchStudents = async () => {
    try {
      const res = await axios.get<Student[]>(
        "http://localhost:8080/students"
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };
 useEffect(() => {
  fetchStudents();
}, []);

  const fetchStudentById = async (id: number): Promise<Student> => {
    const response = await axios.get(`http://localhost:8080/students/${id}`);
    return response.data;
  };

  // 👇 View handler (BEST PRACTICE)
  const handleView = async (id: number) => {
    try {
      // setLoading(true);
      setShowPopupView(true);

      const data = await fetchStudentById(id);
      setStudentDetails(data);
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      // setLoading(false);
    }
  };


  const viewPopup = studentDetails && (
    <div className="popup">
      <h2>Student Details</h2>

      <p><b>Name:</b> {studentDetails.name}</p>
      <p><b>Roll No:</b> {studentDetails.rollNo}</p>
      <p><b>Percentage:</b> {studentDetails.percentage}</p>
      <p><b>Branch:</b> {studentDetails.branch}</p>

      <button onClick={() => setShowPopupView(false)}>Close</button>
    </div>
  );

  const handleEdit = (student: Student) => {
    setMode("EDIT");
    setOriginalStudent(student);
    setStudentForm({ ...student });
    setShowPopup(true);
  };
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setStudentForm({
    ...studentForm,
    [name]:
      name === "percentage" ? Number(value) : value
  });
};

  const isDataChanged =
  mode === "ADD" ||
  JSON.stringify(originalStudent) !== JSON.stringify(studentForm);

  const isFormValid =
  studentForm.name.trim() !== "" &&
  studentForm.percentage !== "" &&
  Number(studentForm.percentage) > 0 &&
  Number(studentForm.percentage) <= 100 &&
  studentForm.branch.trim() !== "";


  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDltPopup(true);
  };

 const confirmDelete = async () => {
  if (!selectedStudent?.rollNo) return;

  try {
    await axios.delete(
      `http://localhost:8080/student/delete/${selectedStudent.rollNo}`
    );

    alert("Student deleted successfully");

    setDltPopup(false);
    fetchStudents()

  } catch (error) {
    console.error("Delete failed", error);
    alert("Failed to delete student");
  }
};



  const handleAdd = () => {
    setMode("ADD");
    setOriginalStudent(null);
    setStudentForm(emptyStudent);
    setShowPopup(true);
  };

  const buildPayload = () => ({
  name: studentForm.name.trim(),
  percentage: Number(studentForm.percentage), // ✅ convert here
  branch: studentForm.branch
});

 const handleSubmit = async () => {
  if (!isFormValid) return;

  const payload = buildPayload(); // ✅ clean POJO

  try {
    if (mode === "ADD") {
      await axios.post(
        "http://localhost:8080/student/add",
        payload
      );
    } else {
      await axios.put(
        `http://localhost:8080/student/update/${studentForm.rollNo}`,
        payload
      );
    }
    fetchStudents()
    setShowPopup(false);
  } catch (err) {
    console.error("Submit failed", err);
  }
};





  return (
    <div className="container">
      <div className="nav">
        <div className="nav-left">
          <img src="" alt="no-img" />
          <h2>Student Management System</h2>

        </div>
        <div className="nav-right">
          <button onClick={handleAdd}>Add Student</button></div>
      </div>

      <div className="main-cards">
        {students.map(student => (
          <div className="student-card" key={student.rollNo}>

            {/* Left side */}
            <div className="student-info">
              <span><b>Roll No:</b> {student.rollNo}</span>
              <span><b>Name:</b> {student.name}</span>
              <span><b>Percentage:</b> {student.percentage}%</span>
              <span><b>Branch:</b> {student.branch}</span>
            </div>

            {/* Right side icons */}
            <div className="student-actions">
              <span
                title="View"
                onClick={() => {
                  if (student.rollNo !== undefined) {
                    handleView(student.rollNo);
                  }
                }}
              >
                👁️
              </span>
              {showPopupView && viewPopup}

              <span title="Edit" onClick={() => handleEdit(student)}>✏️</span>
              <span title="Delete" onClick={() => handleDelete(student)}>🗑️</span>
            </div>

          </div>
        ))}

        {dltPopup && selectedStudent && (
          <div className="popup">
            <h2>Delete Student</h2>
            <p>
              Are you sure you want to delete {selectedStudent.name}
              with roll no {selectedStudent.rollNo}?
            </p>

            <div>
              <button onClick={() => setDltPopup(false)}>Cancel</button>
              <button onClick={confirmDelete}>Yes</button>
            </div>
          </div>
        )}

        {showPopup && (
          <div className="overlay">
            <div className="popup">
              <h3>
                {mode === "ADD"
                  ? "Add Student"
                  : `Edit Student Roll No: ${studentForm.rollNo}`}
              </h3>

              <label>
                Name:
                <input
                  name="name"
                  value={studentForm.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Percentage:
                <input
                  type="number"
                  name="percentage"
                  min={0}
                  max={100}
                  value={studentForm.percentage}
                  onChange={handleChange}
                />
              </label>

              <label>
                Branch:
                <select
                  name="branch"
                  value={studentForm.branch}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </label>

              <div style={{ marginTop: "12px" }}>
                <button onClick={() => setShowPopup(false)}>Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || !isDataChanged}
                  style={{
                    marginLeft: "10px",
                    cursor:
                      isFormValid && isDataChanged ? "pointer" : "not-allowed"
                  }}
                >
                  {mode === "ADD" ? "Add" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}





      </div></div>
  );
}

export default App;
