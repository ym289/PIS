package com.sptc.pis.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import lombok.Data;

@Data
@Entity
@Table(name = "study_treatments", uniqueConstraints = {
		@UniqueConstraint(name = "uk_study_and_treatment", columnNames = {"study_id", "treatment_id"}) })
public class StudyTreatments {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id ;
	
	@Column(name = "study_id")
	private Long studyId;
	
	@Column(name = "treatment_id")
	private Long treatmentId;
	
	
}
