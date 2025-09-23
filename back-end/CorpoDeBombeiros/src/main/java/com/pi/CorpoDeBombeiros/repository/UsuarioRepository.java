package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Integer> {
    Optional<UsuarioModel> findByNomeUsuario(String nomeUsuario);
    boolean existsByNomeUsuario(String nomeUsuario);
}
