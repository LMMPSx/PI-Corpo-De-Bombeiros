package com.api.backend.repository;

import com.api.backend.model.TipoArquivoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoArquivoRepository extends JpaRepository<TipoArquivoModel, Integer> {
    List<TipoArquivoModel> findByNomeTipoArquivo(String nomeTipoArquivo);
}
