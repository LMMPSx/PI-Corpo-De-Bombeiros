package com.api.backend.repository;

import com.api.backend.model.AssinaturaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssinaturaRepository extends JpaRepository<AssinaturaModel, Integer> {
}
