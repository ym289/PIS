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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sptc.pis.dto.StudylistDto;
import com.sptc.pis.model.Billing;
import com.sptc.pis.model.Studylist;
import com.sptc.pis.service.BillingService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class StudylistQueryRepository {

	@PersistenceContext
	public EntityManager em;
	
	@Autowired
	private BillingService billingService;

	public List<StudylistDto> findByMobileNumberOrderByTreatmentDateDesc(String mobileNumber) {
		String query = "select w.mobile_number,p.firstname,p.lastname,w.dignosis,w.treatment,w.treatment_date,"
				+ " w.day_count, w.amount  from studylist w left join patient_data p on w.mobile_number = p.mobile_number"
				+ " where w.mobile_number = :mobileNumber" + " order by treatment_date desc";
		Query searchQuery = em.createNativeQuery(query, Tuple.class).setParameter("mobileNumber", mobileNumber);

		List<StudylistDto> studylists = new ArrayList<>();

		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
				String mobileNumber1 = tuple.get("mobile_number", String.class);
				String firstName = tuple.get("firstname", String.class);
				String lastName = tuple.get("lastname", String.class);
				String dignosis = tuple.get("dignosis", String.class);
				Date treatmentDate = tuple.get("treatment_date", Date.class);
				Integer dayCount = tuple.get("day_count", Integer.class);
				String treatment = tuple.get("treatment", String.class);
				Integer amount = tuple.get("amount", Integer.class);
				
				StudylistDto w = new StudylistDto();
				w.setDayCount(dayCount);
				w.setMobileNumber(mobileNumber1);
				w.setDignosis(dignosis);
				w.setTreatmentDate(treatmentDate);
				w.setTreatment(treatment);
				w.setFirstName(firstName);
				w.setLastName(lastName);
				studylists.add(w);
			}

		return studylists;
	}

	public List<StudylistDto> findAllByTreatmentDate(Date date) {
		String query = "select w.mobile_number,p.firstname,p.lastname,w.dignosis,w.treatment,w.treatment_date,w.day_count,w.amount  from studylist w left join patient_data p on w.mobile_number = p.mobile_number where w.treatment_date = '"
				+ formatDate(date, "yyyy-MM-dd") + "' order by treatment_date desc";
		Query searchQuery = em.createNativeQuery(query, Tuple.class);

		List<StudylistDto> studylists = new ArrayList<>();

		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
				String mobileNumber = tuple.get("mobile_number", String.class);
				String firstName = tuple.get("firstname", String.class);
				String lastName = tuple.get("lastname", String.class);
				String dignosis = tuple.get("dignosis", String.class);
				Date treatmentDate = tuple.get("treatment_date", Date.class);
				Integer dayCount = tuple.get("day_count", Integer.class);
				String treatment = tuple.get("treatment", String.class);
				Integer amount = tuple.get("amount", Integer.class);

				StudylistDto w = new StudylistDto();
				w.setDayCount(dayCount);
				w.setMobileNumber(mobileNumber);
				w.setDignosis(dignosis);
				w.setTreatmentDate(treatmentDate);
				w.setTreatment(treatment);
				w.setFirstName(firstName);
				w.setLastName(lastName);
				studylists.add(w);
			}

		return studylists;
	}

	public static String formatDate(Date date, String format) {
		String dateStr = null;
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		if (date != null)
			dateStr = sdf.format(date);
		return dateStr;
	}

	public List<StudylistDto> getStudyList(String mobileNumber, String firstName, String lastName, List<String> treatmentList,
			Date treatmentDate, Integer pageNumber, Integer pageSize) {
		String query = "select s.id,s.mobile_number,p.firstname,p.lastname,s.dignosis,s.treatment_date,"
				+ " s.day_count, s.amount_edited from studylist s left join patient_data p on s.mobile_number = p.mobile_number"
				+ " where 1 =1 ";
		

		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			query += " and s.mobile_number = :mobileNumber";
		}
		if (firstName != null && !firstName.trim().isEmpty()) {
			query += " and p.firstName = :firstName";
		}
		if (lastName != null && !lastName.trim().isEmpty()) {
			query += " and p.lastName = :lastName";
		}
		if (treatmentList !=null && !treatmentList.isEmpty() ) {
			query += " and s.id in ( select st.study_id from study_treatments st left join treatments t"
					+ " on st.treatment_id = t.id where t.treatment in ( :treatment) )";
		}
		if (treatmentDate != null ) {
			query += " and s.treatment_date = :treatmentDate";
		}
		
		
		query+=" order by treatment_date desc, s.id desc limit "+ pageSize +" OFFSET "+ ((pageNumber-1)*pageSize);
//		log.info("search query is :{}",query);
		
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
		if (treatmentList !=null && !treatmentList.isEmpty() ) {
			searchQuery.setParameter("treatment", treatmentList);
		}
		if (treatmentDate != null ) {
			searchQuery.setParameter("treatmentDate", formatDate(treatmentDate, "yyyy-MM-dd"));
		}
		

		List<StudylistDto> studylists = new ArrayList<>();

		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
		

				StudylistDto s = new StudylistDto();
				s.setId(tuple.get("id",BigInteger.class).longValue());
				s.setDayCount(tuple.get("day_count", Integer.class));
				s.setMobileNumber(tuple.get("mobile_number", String.class));
				s.setDignosis(tuple.get("dignosis", String.class));
				s.setTreatmentDate(tuple.get("treatment_date", Date.class));
				s.setFirstName(tuple.get("firstname", String.class));
				s.setLastName(tuple.get("lastname", String.class));	
				s.setAmountEdited(tuple.get("amount_edited",Boolean.class));
				List<String> treatments = getTreatments(tuple.get("id", BigInteger.class).longValue());
				s.setTreatmentList(treatments);
				
				List<Billing> bills = getBillsByStudyId(tuple.get("id", BigInteger.class).longValue());
				s.setBill(bills);
				studylists.add(s);
			}

		return studylists;
	}

	private List<Billing> getBillsByStudyId(Long studyId) {
		return billingService.getBillsByStudyId(studyId);
	}

	private List<String> getTreatments(Long studyId) {
		
		String query = "select t.treatment from treatments t left join study_treatments st  on st.treatment_id = t.id where st.study_id =:studyId";
		Query searchQuery = em.createNativeQuery(query, Tuple.class).setParameter("studyId", studyId);
		List<String> treatmentList = new ArrayList<>();

		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {

				treatmentList.add(tuple.get("treatment", String.class));
			}

		return treatmentList;
	}

	public Long getStudyCount(String mobileNumber, String firstName, String lastName, String treatment,
			Date treatmentDate) {
		String query = "select count(*) as count from studylist s left join patient_data p on s.mobile_number = p.mobile_number"
				+ " where 1 =1 ";
		

		if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
			query += " and s.mobile_number = :mobileNumber";
		}
		if (firstName != null && !firstName.trim().isEmpty()) {
			query += " and p.firstName = :firstName";
		}
		if (lastName != null && !lastName.trim().isEmpty()) {
			query += " and p.lastName = :lastName";
		}
		if (treatment != null && !treatment.trim().isEmpty()) {
			query += " and s.id in ( select st.study_id from study_treatments st left join treatments t"
					+ " on st.treatment_id = t.id where t.treatment = :treatment )";
		}
		if (treatmentDate != null ) {
			query += " and s.treatment_date = :treatmentDate";
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
		if (treatment != null && !treatment.trim().isEmpty()) {
			searchQuery.setParameter("treatment", treatment);
		}
		if (treatmentDate != null ) {
			searchQuery.setParameter("treatmentDate", formatDate(treatmentDate, "yyyy-MM-dd"));
		}
		

		Long count = 0L;
		
		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
				 count = tuple.get("count", BigInteger.class).longValue();
			}

		return count;

	}

	public Integer getTotalAmount(Date treatmentDate) {
		String query = "select SUM(b.amount)  as totalAmount from billing b where b.date = '"+ formatDate(treatmentDate, "yyyy-MM-dd") + "'";
		Query searchQuery = em.createNativeQuery(query, Tuple.class);
		log.info("total amount query : {}", query.toString());
		Integer totalAmount = 0;
		List<Tuple> resultList = (List<Tuple>) searchQuery.getResultList();
		if (resultList != null && !resultList.isEmpty())
			for (Tuple tuple : resultList) {
				if(tuple!=null)
				totalAmount = tuple.get("totalAmount", BigInteger.class)!=null?tuple.get("totalAmount", BigInteger.class).intValue():0;
			}

		return totalAmount;

	}
}
