package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.AssinaturaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssinaturaRepository extends JpaRepository<AssinaturaModel, Long> {
}
