package com.sptc.pis.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sptc.pis.model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {

	@Transactional
	void deleteByMobileNumber(String mobileNumber);

	Patient findByMobileNumber(String mobileNumber);

}

