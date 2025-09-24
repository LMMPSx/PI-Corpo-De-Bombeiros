package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.LogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogModel, Integer> {

    List<LogModel> findByUsuario(String usuario);

    List<LogModel> findByEntidadeAlterada(String entidade);
}
