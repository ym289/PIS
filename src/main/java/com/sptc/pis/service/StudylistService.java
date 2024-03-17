package com.sptc.pis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sptc.pis.dto.StudylistDto;
import com.sptc.pis.model.Studylist;
import com.sptc.pis.repository.StudyTreatmentsRepository;
import com.sptc.pis.repository.StudylistQueryRepository;
import com.sptc.pis.repository.StudylistRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StudylistService {

	
	@Autowired
	private StudylistRepository studylistRepository;

	@Autowired
	private StudyTreatmentsRepository studyTreatmentsRepository;
	
	@Autowired
	private StudylistQueryRepository studylistQueryRepository;
	
	@Autowired
	private BillingService billingService;
	
	
	public boolean updateDignosis(StudylistDto studylistDto) {
		log.info("EDITING STUDY DIGNOSIS {}" ,studylistDto.toString());	

		try {
		Studylist wl = studylistRepository.findByMobileNumberAndTreatmentDate(studylistDto.getMobileNumber(), studylistDto.getTreatmentDate());
		if(wl == null) {
			log.info("wl is null");
		}
		log.info("mobile is :{}",studylistDto.getMobileNumber());
		log.info("date is :{}",studylistDto.getTreatmentDate());

		log.info("dignosis is :{}",studylistDto.getDignosis());
		wl.setDignosis(studylistDto.getDignosis());
		studylistRepository.save(wl);
		return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	
	public boolean deleteStudy(Long studyId) {
		try {
		log.info("DELETING STUDY with ID :{}",studyId);
		studyTreatmentsRepository.deleteAllByStudyId(studyId);
		billingService.deleteAllByStudyId(studyId);
		studylistRepository.deleteById(studyId);
		return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}


	public Integer getTotalAmount(StudylistDto studylistDto) {
		log.info("GETTING TOTAL AMOUNT");

		return studylistQueryRepository.getTotalAmount(studylistDto.getTreatmentDate());
	}
	
	
}
