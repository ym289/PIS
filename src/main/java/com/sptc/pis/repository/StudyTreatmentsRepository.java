package com.sptc.pis.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sptc.pis.model.StudyTreatments;


@Repository
public interface StudyTreatmentsRepository extends JpaRepository<StudyTreatments, String> {


	@Transactional
	public void deleteAllByStudyId(Long studyId);
	
	
	
}

