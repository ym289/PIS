package com.sptc.pis.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sptc.pis.model.Treatments;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatments, String> {


	Treatments findByTreatmentName(String treatment);


}

