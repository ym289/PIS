package com.sptc.pis.dto;

import java.util.Date;
import java.util.List;

import com.sptc.pis.model.Billing;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudylistDto {

	public long id;
	
	public String mobileNumber;
	
	public String dignosis;
	
	public Date treatmentDate;
	
	public String firstName;
	
	public String lastName;
	
	public Integer dayCount;
	
	public String treatment;
	
	public List<String> treatmentList;
	
	public String gender;
	
	public Date birthDate;
	
	public String city;
	
	public List<Billing> bill;
	
	public Boolean amountEdited;
	
	
}
