package com.sptc.pis.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sptc.pis.model.Billing;
import com.sptc.pis.model.Studylist;
import com.sptc.pis.repository.BillingRepository;
import com.sptc.pis.repository.StudylistRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BillingService {

	@Autowired
	public BillingRepository billingRepository;
	
	@Autowired
	public StudylistRepository studylistRepository;

	public void addBill(Integer amount, String description, Date date, Long studyId) {
		log.info("ADDING BILL : STUDY ID : {}, AMOUNT : {} ", studyId, amount);
		Billing bill = new Billing();
		bill.setAmount(amount);
		bill.setDescription(description);
		bill.setDate(new Date());
		bill.setStudyId(studyId);

		billingRepository.save(bill);
	}

	public List<Billing> getBillsByStudyId(Long studyId) {
		return billingRepository.findAllByStudyId(studyId);
	}

	public boolean editBills(List<Billing> bills) {
		
		log.info("EDITING BILL :  {}", bills.toString());

		try {
		for(Billing newBill : bills){
			Studylist study = studylistRepository.findById(newBill.getStudyId()).get();
			if(new SimpleDateFormat("dd-MM-yy").parse(new SimpleDateFormat("dd-MM-yy").format(new Date())).compareTo(study.getTreatmentDate())!=0) {
				log.info("Date of bill and date of study mismatch");
				throw new Exception("Date of bill and date of study mismatch");
//				return false;
			}
			if(newBill.getId()!=null) {
				Billing bill = billingRepository.findById(newBill.getId().longValue());
				if(newBill.getDescription()!=null) {
					bill.setDescription(newBill.getDescription());
				}
				if(newBill.getAmount()!=null) {
					bill.setAmount(newBill.getAmount());
				}
				if(newBill.getDescription()!=null && newBill.getAmount() !=null && newBill.getAmount()!=0) {
					billingRepository.save(bill);
					study.setAmountEdited(true);
					studylistRepository.save(study);
				}
				
			}else {
				Billing bill = new Billing();
				if(newBill.getDescription()!=null) {
					bill.setDescription(newBill.getDescription());
				}
				if(newBill.getAmount()!=null) {
					bill.setAmount(newBill.getAmount());
					bill.setDate(new Date());
					bill.setStudyId(newBill.getStudyId());
				}
				if(newBill.getDescription()!=null && newBill.getAmount() !=null && newBill.getAmount()!=0) {
				billingRepository.save(bill);
				study.setAmountEdited(true);
				studylistRepository.save(study);
				}
			}
			
		}
			return true;
		}catch(Exception e ) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean deleteBill(Billing bill) {
		
		log.info("DELETING BILL : {}", bill.toString());

		try {
		billingRepository.deleteById(bill.getId().longValue());
		return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public void deleteAllByStudyId(Long studyId) {
		log.info("DELETING ALL BILLS BY STUDY ID : {}", studyId);

		billingRepository.deleteAllByStudyId(studyId);
		
	}
}
