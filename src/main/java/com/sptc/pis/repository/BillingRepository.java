package com.sptc.pis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sptc.pis.model.Billing;
import com.sptc.pis.model.Patient;

@Repository
public interface BillingRepository extends JpaRepository<Billing, String> {

	List<Billing> findAllByStudyId(Long studyId);
	
	Billing findById(Long id);

	@Transactional
	void deleteById(Long id);

	@Transactional
	void deleteAllByStudyId(Long studyId);

	

}