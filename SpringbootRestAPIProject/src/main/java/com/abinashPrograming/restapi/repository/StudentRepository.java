package com.abinashPrograming.restapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abinashPrograming.restapi.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {

}
