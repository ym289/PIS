package com.sptc.pis.pisApi;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sptc.pis.dto.PatientDto;
import com.sptc.pis.dto.StudylistDto;
import com.sptc.pis.model.Billing;
import com.sptc.pis.model.Patient;
import com.sptc.pis.model.Studylist;
import com.sptc.pis.service.BillingService;
import com.sptc.pis.service.PatientService;
import com.sptc.pis.service.StudylistService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PisApi {

	@Autowired
	private PatientService patientService;

	@Autowired
	private StudylistService studylistService;
	
	@Autowired
	private BillingService billingService;

	@PostMapping("/add-new-patient")
	public ResponseEntity<Boolean> addNewPatient(@RequestBody PatientDto patientDto) {

		ResponseEntity re = null;

		String firstName = patientDto.getFirstName();
		String lastName = patientDto.getLastName();
		Date birthDate = patientDto.getBirthDate();
		String gender = patientDto.getGender();
		String mobileNumber = patientDto.getMobileNumber();
		String city = patientDto.getCity();
		Integer amount = patientDto.getAmount();
		
		String newPatientMessage = patientService.addNewPatient(firstName, lastName, birthDate, gender, mobileNumber,city);
		if(!newPatientMessage.contains("Patient added successfully")) {
			re = new ResponseEntity<String>(newPatientMessage, HttpStatus.INTERNAL_SERVER_ERROR);
			return re;
		}
		String successMessage = null;
		if (patientDto.isAddToStudyList()) {
			successMessage = patientService.addToStudyList(mobileNumber,amount,false);
			if(successMessage.contains("Patient already present in today's studylist. Can not add again.")) {
				re = new ResponseEntity<String>(successMessage, HttpStatus.METHOD_NOT_ALLOWED);
			}
			if(successMessage.contains("Patient added successfully")) {
				re = new ResponseEntity<String>(successMessage, HttpStatus.OK);	
			}
			if(successMessage.contains("Error while adding patient to studylist :")) {
				re = new ResponseEntity<String>(successMessage, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		if (newPatientMessage.contains("Patient added successfully")) {
			if (!successMessage.contains("Patient added successfully")) {
				patientService.deleteByMobileNumber(mobileNumber);
			}
		}
		return re;
	}

	@PostMapping("/add-existing-patient")
	public ResponseEntity<String> addExistingPatient(@RequestBody PatientDto patientDto) {

		ResponseEntity re = null;
		Boolean isPatientPresent = patientService.isPatientExists(patientDto.getMobileNumber());
		if (isPatientPresent) {
			String mobileNumber = patientDto.getMobileNumber();
			Integer amount = patientDto.getAmount();
			String successMessage = patientService.addToStudyList(mobileNumber,amount,patientDto.isContinueLastRecord());
			if(successMessage.contains("Patient already present in today's studylist. Can not add again.")) {
				re = new ResponseEntity<String>(successMessage, HttpStatus.METHOD_NOT_ALLOWED);
			}
			if(successMessage.contains("Patient added successfully")) {
				re = new ResponseEntity<String>(successMessage, HttpStatus.OK);	
			}
			if(successMessage.contains("Error while adding patient to studylist :")) {
				re = new ResponseEntity<String>(successMessage, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			return re;
		} else{
			re = new ResponseEntity<String>("Patient does not exist. Please add as a new patient", HttpStatus.METHOD_NOT_ALLOWED);
			return re;
		}

	}

	@PostMapping("/get-studylist/{pageNumber}/{pageSize}")
	public ResponseEntity<ResponseDto<Page<StudylistDto>>> getStudylist(@RequestBody StudylistDto studylistDto,
			@PathVariable Integer pageNumber, @PathVariable Integer pageSize) {

		List<StudylistDto> studylist = patientService.getStudylist(studylistDto, pageNumber, pageSize);
		Long totalStudiesCount = patientService.getStudyCount(studylistDto);
		Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
		final int start = (int) pageable.getOffset();
		final int end = Math.min((start + pageable.getPageSize()), studylist.size());
		final Page<StudylistDto> userPaginated = new PageImpl<>(studylist, pageable, totalStudiesCount);

		return ResponseEntity.ok(new ResponseDto<>(HttpStatus.OK.value(), "StudyList", userPaginated));

	}

	@PostMapping("/get-patient-list/{pageNumber}/{pageSize}")
	public ResponseEntity<ResponseDto<Page<Patient>>> getPatientlist(@RequestBody StudylistDto studylistDto,
			@PathVariable Integer pageNumber, @PathVariable Integer pageSize) {

		List<Patient> patientlist = patientService.getPatientlist(studylistDto, pageNumber, pageSize);
		Long totalPatientCount = patientService.getPatientCount(studylistDto);
		Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
		final int start = (int) pageable.getOffset();
		final int end = Math.min((start + pageable.getPageSize()), patientlist.size());
		final Page<Patient> userPaginated = new PageImpl<>(patientlist, pageable, totalPatientCount);

		return ResponseEntity.ok(new ResponseDto<>(HttpStatus.OK.value(), "PatientList", userPaginated));

	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/edit-patient/")
	public ResponseEntity<Boolean> editPatient(@RequestBody StudylistDto studylistDto) {

		Boolean success = patientService.editPatient(studylistDto);		
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/edit-study/")
	public ResponseEntity<Boolean> editStudy(@RequestBody StudylistDto studylistDto) {

		Boolean success = patientService.editStudy(studylistDto);		
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/get-total-amount/")
	public ResponseEntity<Integer> getTotalAmount(@RequestBody StudylistDto studylistDto) {

		Integer amount = studylistService.getTotalAmount(studylistDto);		
		return new ResponseEntity<Integer>(amount, HttpStatus.OK);
	}
	
	@PostMapping("/save-dignosis-data")
	public ResponseEntity<Boolean> saveDignosisData(@RequestBody StudylistDto studylistDto) {

		boolean success = studylistService.updateDignosis(studylistDto);
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/delete-study/{studyId}")
	public ResponseEntity<Boolean> deleteStudy(@PathVariable Long studyId) {

		boolean success = studylistService.deleteStudy(studyId);
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/delete-patient/{mobileNumber}")
	public ResponseEntity<Boolean> deletePatient(@PathVariable String mobileNumber) {

		boolean success = patientService.deletePatient(mobileNumber);
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/edit-amount")
	public ResponseEntity<Boolean> editBills(@RequestBody List<Billing> bills) {

		boolean success = billingService.editBills(bills);
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/delete-amount")
	public ResponseEntity<Boolean> deleteBill(@RequestBody Billing bill) {

		boolean success = billingService.deleteBill(bill);
		return new ResponseEntity<Boolean>(success, HttpStatus.OK);
	}
}