package com.abinashPrograming.restapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.abinashPrograming.restapi.entity.Student;
import com.abinashPrograming.restapi.repository.StudentRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.RequestMethod;

// @CrossOrigin(
//     origins = "http://localhost:3000", // or 5173 for Vite
//     allowedHeaders = "*",
//     methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
// )

// @CrossOrigin(origins = "http://localhost:3000")

@RestController
public class StudentController {

    @Autowired
    private StudentRepository repo;

    // GET all students
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return repo.findAll();
    }

    @GetMapping("/students/{id}")
    public Student getStudent(@PathVariable int id) {
        Student student = repo.findById(id).get();
        return student;
    }

    @PostMapping("/student/add")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {

        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }

        Student savedStudent = repo.save(student);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
    @PutMapping("student/update/{id}")
    public Student putMethodName(@PathVariable int id, @RequestBody Student student) {
        // Student student= repo.findById(id).get();
        Student existStudent = repo.findById(id).get();
        existStudent.setName(student.getName());
        existStudent.setBranch(student.getBranch());
        existStudent.setPercentage(student.getPercentage());
        return repo.save(existStudent);
        
    }

    @DeleteMapping("/student/delete/{id}")
    public String deleteStudent (@PathVariable int id){
        Student existStudent = repo.findById(id).get();
        repo.delete(existStudent);
        return ("student deleted:" + id);
    }

}
