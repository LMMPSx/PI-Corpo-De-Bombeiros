package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.LogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<LogModel, Long> {
}
