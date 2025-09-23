package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.EnderecoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnderecoRepository extends JpaRepository<EnderecoModel, Integer> {
}
