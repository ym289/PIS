package com.sptc.pis.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientDto {

	
	public String patientId;
	
	public String firstName;
	
	public String lastName;
	
	public String mobileNumber;
	
	public Date birthDate;
	
	public String gender;
	
	public boolean addToStudyList;
	
	public String city;
	
	public boolean continueLastRecord;
	
	public Integer amount;
	
	
	
	
}
