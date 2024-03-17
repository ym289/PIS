package com.sptc.pis.model;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;


import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
@Entity
@Table(name = "patient_data", uniqueConstraints = {
@UniqueConstraint(name = "uk_contraint_mobile_number", columnNames = { "mobile_number"}) })
public class Patient {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id ;
	
	//@Size(max = 10)
	@Column(name = "mobile_number", length = 40, nullable = false)
	private String mobileNumber;
	
	@Column(name = "firstname", length = 50/*, nullable = false*/)
	private String firstName;
	
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@Column(name = "dob")
	private Date birthDate;
	
	@Column(name="gender")
	private String gender;
	
	@Column(name = "lastname")
	private String lastName;
	
	
	@Column(name = "city")
	private String city;
	
	
}



