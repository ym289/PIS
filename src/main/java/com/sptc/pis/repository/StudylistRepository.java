package com.sptc.pis.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sptc.pis.model.Studylist;

@Repository
public interface StudylistRepository extends JpaRepository<Studylist, String> {

	List<Studylist> findAllByTreatmentDate(Date date);

	Studylist findByMobileNumberAndTreatmentDate(String mobileNumber, Date date);

	@Transactional
	void deleteByMobileNumber(String mobileNumber);

	@Transactional
	void deleteById(Long studyId);

	@Transactional
	void deleteAllByMobileNumber(String mobileNumber);

	List<Studylist> findAllByMobileNumber(String mobileNumber);

	Optional<Studylist> findById(Long id);

	List<Studylist> findByMobileNumberOrderByIdDesc(String mobileNumber);

}
