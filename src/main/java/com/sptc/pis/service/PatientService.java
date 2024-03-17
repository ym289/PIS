package com.sptc.pis.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sptc.pis.dto.PatientDto;
import com.sptc.pis.dto.StudylistDto;
import com.sptc.pis.model.Billing;
import com.sptc.pis.model.Patient;
import com.sptc.pis.model.StudyTreatments;
import com.sptc.pis.model.Studylist;
import com.sptc.pis.model.Treatments;
import com.sptc.pis.repository.PatientQueryRepository;
import com.sptc.pis.repository.PatientRepository;
import com.sptc.pis.repository.StudyTreatmentsRepository;
import com.sptc.pis.repository.StudylistQueryRepository;
import com.sptc.pis.repository.StudylistRepository;
import com.sptc.pis.repository.TreatmentRepository;

import lombok.extern.slf4j.Slf4j;

@Transactional 
@Service
@Slf4j
public class PatientService {

	
	@Autowired
	private PatientRepository patientRepository;
	
	@Autowired
	private StudylistRepository studylistRepository;
	
	@Autowired
	private StudylistQueryRepository studylistQueryRepository;
	
	@Autowired
	private PatientQueryRepository patientQueryRepository;
	
	@Autowired
	private StudyTreatmentsRepository studyTreatmentsRepository;
	
	@Autowired
	private TreatmentRepository treatmentRepository;
	
	@Autowired
	private BillingService billingService;
		
	
	public String addNewPatient(String firstName, String lastName, Date birthDate, String gender,
			String mobileNumber,String city) {		
		try {
		
		log.info("ADDING NEW PATIENT : mobileNumber : {}", mobileNumber);
		
		Patient patient = patientRepository.findByMobileNumber( mobileNumber);
		if(patient!=null) {
			log.info("Patient already exists. Add as existing patient. mobileNumber : {}", mobileNumber);
			return "Patient already exists. Add as existing patient";
		}
		patient = new Patient();
		
		patient.setFirstName(firstName);
		patient.setLastName(lastName);
		patient.setMobileNumber(mobileNumber);
		patient.setGender(gender);
		patient.setBirthDate(birthDate);
		patient.setCity(city);
		patientRepository.save(patient);
		return "Patient added successfully";
		}catch(Exception e) {
			log.info("Failed to add patient: {}", e.getMessage());
			return "Error while adding new patient : " +e.getMessage();
		}		
	}

	public String addToStudyList(String mobileNumber,Integer amount, boolean continueLastRecord) {		
		try {
		
		log.info("ADDING PATIENT to STUDYLIST : mobileNumber : {}, continueLastRecord : {}", mobileNumber, continueLastRecord);	
		Studylist todaysStudylist= studylistRepository.findByMobileNumberAndTreatmentDate(mobileNumber,new Date());
		if(todaysStudylist !=null) {
		log.info("patient already present in today's studylist, mobileNumber : {}", mobileNumber);
			return "Patient already present in today's studylist. Can not add again.";
		}	
		Studylist wl = new Studylist();
		wl.setMobileNumber(mobileNumber);
		wl.setTreatmentDate(new Date());
		
		
//		Calendar cal = Calendar.getInstance();
//        cal.add(Calendar.DATE, -1);

//        Date yesterday = cal.getTime();
//		Studylist studylist = studylistRepository.findByMobileNumberAndTreatmentDate(mobileNumber,yesterday);
//		if(studylist!=null) {
//		}else {
//			wl.setDayCount(1);
		
//		}
		if(continueLastRecord) {
		List<Studylist> studylist1 = studylistRepository.findByMobileNumberOrderByIdDesc(mobileNumber);
		if(!studylist1.isEmpty())
		{
			Studylist studylist = studylist1.get(0);
			wl.setDayCount(studylist.getDayCount()+1);
			wl.setDignosis(studylist.getDignosis());	
		}else {
			wl.setDayCount(1);
		}
		}else {
			wl.setDayCount(1);
		}
		
		 wl = studylistRepository.save(wl);
		billingService.addBill(amount,"Checkup fees",new Date(),wl.getId());
		
		return "Patient added successfully";
		}catch(Exception e){
			log.info("Exception while adding patient to Studylist :{}",e.getMessage());
			e.printStackTrace();
			return "Error while adding patient to studylist : "+e.getMessage();			
		}	
	}



	public void deleteStudylistByMobileNumber(String mobileNumber){
		log.info("DELETING STUDY by mobileNumber : {}", mobileNumber);	

		studylistRepository.deleteByMobileNumber(mobileNumber);
	}

	public List<StudylistDto> getStudylist(StudylistDto studylistDto, Integer pageNumber, Integer pageSize) {
		
		String mobileNumber = studylistDto.getMobileNumber();
		List<StudylistDto> studylist = null;
		String firstName = studylistDto.getFirstName();
		String lastName = studylistDto.getLastName();
		List<String> treatmentList = studylistDto.getTreatmentList();
		Date treatmentDate = studylistDto.getTreatmentDate();
		
		studylist = studylistQueryRepository.getStudyList(mobileNumber,firstName,lastName,treatmentList,treatmentDate,pageNumber,pageSize);
		
		return studylist;
	}

	public List<Patient> getPatientlist(StudylistDto studylistDto, Integer pageNumber, Integer pageSize) {	
		String mobileNumber = studylistDto.getMobileNumber();
		String firstName = studylistDto.getFirstName();
		String lastName = studylistDto.getLastName();
		List<Patient> patientList = patientQueryRepository.getPatientList(mobileNumber, firstName, lastName, pageNumber, pageSize);
		return patientList;		
	}

	public void deleteByMobileNumber(String mobileNumber) {
		log.info("DELETING PATIENT by mobileNumber : {}", mobileNumber);	

		patientRepository.deleteByMobileNumber(mobileNumber);		
	}

	public Long getStudyCount(StudylistDto studylistDto) {
		
		
		String mobileNumber = studylistDto.getMobileNumber();
		String firstName = studylistDto.getFirstName();
		String lastName = studylistDto.getLastName();
		String treatment = studylistDto.getTreatment();
		Date treatmentDate = studylistDto.getTreatmentDate();
		
		Long studyCount = studylistQueryRepository.getStudyCount(mobileNumber,firstName,lastName,treatment,treatmentDate);

		return studyCount;
	}

	public Long getPatientCount(StudylistDto studylistDto) {
		String mobileNumber = studylistDto.getMobileNumber();
		String firstName = studylistDto.getFirstName();
		String lastName = studylistDto.getLastName();
		String treatment = studylistDto.getTreatment();
		Date treatmentDate = studylistDto.getTreatmentDate();
		
		Long studyCount = patientQueryRepository.getPatientCount(mobileNumber,firstName,lastName,treatment,treatmentDate);

		return studyCount;
	}

	public boolean deletePatient(String mobileNumber) {
		log.info("DELETING PATIENT by mobileNumber : {}", mobileNumber);	

		try {
		List<Long> studyIds = studylistRepository.findAllByMobileNumber(mobileNumber).stream().map(f -> f.getId())
				.collect(Collectors.toList());;
		studyIds.forEach(studyId ->{
			studyTreatmentsRepository.deleteAllByStudyId(studyId);		
		});
		studylistRepository.deleteAllByMobileNumber(mobileNumber);
		patientRepository.deleteByMobileNumber(mobileNumber);
		
		return true;
		}catch(Exception e ) {
			e.printStackTrace();
			return false;
			
		}
	}

	public Boolean isPatientExists(String mobileNumber) {
		log.info("isPatientExists by mobileNumber : {}", mobileNumber);	

		Patient patient = patientRepository.findByMobileNumber(mobileNumber);
		
		if(patient !=null) {
			log.info("isPatientExists by mobileNumber : {} : true", mobileNumber);	
			return true;
		}else {
			log.info("isPatientExists by mobileNumber : {} : false", mobileNumber);	
			return false;
		}
	}

	public Boolean editPatient(StudylistDto studylistDto) {
		log.info("EDITING PATIENT  : {}" ,studylistDto.toString());	

		String mobileNumber = studylistDto.getMobileNumber();
		String firstName = studylistDto.getFirstName();
		String lastName = studylistDto.getLastName();
		String gender = studylistDto.getGender();
		Date birthDate = studylistDto.getBirthDate();
		String city = studylistDto.getCity();

		try {
		Patient patient = patientRepository.findByMobileNumber(mobileNumber);
		if(birthDate !=null && !birthDate.toString().trim().isEmpty())
		patient.setBirthDate(birthDate);
		if(firstName !=null && !firstName.trim().isEmpty())
		patient.setFirstName(firstName);
		if(lastName !=null && !lastName.trim().isEmpty())
		patient.setLastName(lastName);
		if(gender !=null && !gender.trim().isEmpty())
		patient.setGender(gender);
		if(city !=null && !city.trim().isEmpty())
		patient.setCity(city);
		
		patientRepository.save(patient);
		return true;
		}catch(Exception e) {
			return false;
		}
		
	}

	public Boolean editStudy(StudylistDto studylistDto) {
		log.info("EDITING STUDY  : {}" ,studylistDto.toString());	

		
		long studyId = studylistDto.getId();
		String dignosis = studylistDto.getDignosis();
		String treatment = studylistDto.getTreatment();
		Date treatmentDate = studylistDto.getTreatmentDate();
		Integer dayCount = studylistDto.getDayCount();
		
		List<String> treatmentList  = studylistDto.getTreatmentList();
		
		try {
		Studylist study = studylistRepository.findById(studyId).get();
		if(dignosis !=null && !dignosis.trim().isEmpty())
			study.setDignosis(dignosis);
		if(treatment !=null && !treatment.trim().isEmpty())
			study.setTreatment(treatment);
		if(treatmentDate !=null && !treatmentDate.toString().trim().isEmpty())
			study.setTreatmentDate(treatmentDate);
		if(dayCount !=null )
			study.setDayCount(dayCount);
		editStudyTreatments(treatmentList,studyId);
		
		studylistRepository.save(study);
		return true;
		}catch(Exception e) {
			return false;
		}

	}

	private void editStudyTreatments(List<String> treatmentList, long studyId) throws Exception {
		log.info("EDITING STUDY TREATMENTS  STUDY ID :{}, TREATMENTS: {}" ,treatmentList.toString());	

		studyTreatmentsRepository.deleteAllByStudyId(studyId);
		
		treatmentList.forEach(treatment->{
			Treatments t1 = treatmentRepository.findByTreatmentName(treatment);
			log.info("treatment is :{}",treatment);
			if(t1==null) {
				t1 = new Treatments();
				t1.setTreatmentName(treatment);
				t1 = treatmentRepository.save(t1);
			}
			StudyTreatments st = new StudyTreatments();
			st.setStudyId(studyId);
			st.setTreatmentId(t1.getId());
			studyTreatmentsRepository.save(st);
		});
		
	}



}
