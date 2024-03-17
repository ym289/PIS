package com.sptc.pis.repository;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.Tuple;

import org.springframework.stereotype.Repository;

import com.sptc.pis.dto.StudylistDto;
import com.sptc.pis.model.Patient;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class PatientQueryRepository {

	@PersistenceContext
	public EntityManager em;

	public static String formatDate(Date date, String format) {
		String dateStr = null;
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		if (date != null)
			dateStr = sdf.format(date);
		return dateStr;
	}

	public List<Patient> getPatientList(String mobileNumber, String firstName, String lastName, 
			Integer pageNumber, Integer pageSize) {
		String query = "select * from patient_data pd"
				+ " where 1 =1 ";
		

		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			query += " and pd.mobile_number = :mobileNumber";
		}
		if (firstName != null && !firstName.trim().isEmpty()) {
			query += " and pd.firstName = :firstName";
		}
		if (lastName != null && !lastName.trim().isEmpty()) {
			query += " and pd.lastName = :lastName";
		}
	
		
		
		query+=" order by id desc limit "+ pageSize +" OFFSET "+ ((pageNumber-1)*pageSize);
		log.info("search query is :{}",query);
		
		Query searchQuery = em.createNativeQuery(query, Tuple.class);
		
		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			searchQuery.setParameter("mobileNumber", mobileNumber);
		}
		if (firstName != null && !firstName.trim().isEmpty()) {
			searchQuery.setParameter("firstName", firstName);
		}
		if (lastName != null && !lastName.trim().isEmpty()) {
			searchQuery.setParameter("lastName", lastName);
		}
		
		

		List<Patient> patientsList = new ArrayList<>();

		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
		

				Patient p = new Patient();
				p.setMobileNumber(tuple.get("mobile_number", String.class));
				p.setFirstName(tuple.get("firstname", String.class));
				p.setLastName(tuple.get("lastname", String.class));	
				p.setId(tuple.get("id", BigInteger.class).longValue());
				p.setGender(tuple.get("gender", String.class));
				p.setBirthDate(tuple.get("dob", Date.class));
				p.setCity(tuple.get("city", String.class));

				patientsList.add(p);
			}

		return patientsList;
	}

	public Long getPatientCount(String mobileNumber, String firstName, String lastName, String treatment,
			Date treatmentDate) {
		String query = "select count(*) as count from patient_data pd"
				+ " where 1 =1 ";
		

		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			query += " and pd.mobile_number = :mobileNumber";
		}
		if (firstName != null && !firstName.trim().isEmpty()) {
			query += " and pd.firstName = :firstName";
		}
		if (lastName != null && !lastName.trim().isEmpty()) {
			query += " and pd.lastName = :lastName";
		}
	
		
		
		log.info("count query is :{}",query);
		
		Query searchQuery = em.createNativeQuery(query, Tuple.class);
		
		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			searchQuery.setParameter("mobileNumber", mobileNumber);
		}
		if (firstName != null && !firstName.trim().isEmpty()) {
			searchQuery.setParameter("firstName", firstName);
		}
		if (lastName != null && !lastName.trim().isEmpty()) {
			searchQuery.setParameter("lastName", lastName);
		}
		
		


		Long count = 0L;
		
		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
				 count = tuple.get("count", BigInteger.class).longValue();
			}

		return count;

	}
}
