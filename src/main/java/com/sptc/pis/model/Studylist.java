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

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
@Entity
@Table(name = "studylist")
public class Studylist {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id ;
	
	
	@Column(length = 40)
	private String mobileNumber;
	
	@Column(length = 200)
	private String dignosis;
	
	@Column(name = "treatment", length = 400/*, nullable = false*/)
	private String treatment;
	
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "dd-MM-yyyy")
	@Column(name = "treatment_date")
	private Date treatmentDate;
	
	@Column(name="day_count")
	private int dayCount;	
	
	@Column(name="amountEdited")
	private Boolean amountEdited;
	
	
}



