package com.api.backend.repository;

import com.api.backend.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Integer> {
    Optional<UsuarioModel> findByCpf(String cpf);
    Optional<UsuarioModel> findByNomeUsuario(String nomeUsuario);
    boolean existsByCpf(String cpf);
    boolean existsByNomeUsuario(String nomeUsuario);
}
