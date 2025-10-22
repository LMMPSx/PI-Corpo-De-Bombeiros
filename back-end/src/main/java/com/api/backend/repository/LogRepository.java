package com.api.backend.repository;

import com.api.backend.model.LogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogModel, Integer> {

    List<LogModel> findByUsuario_NomeUsuario(String nomeUsuario);

    List<LogModel> findByUsuario_IdUsuario(Integer idUsuario);

    List<LogModel> findByEntidadeAlterada(String entidadeAlterada);
}
