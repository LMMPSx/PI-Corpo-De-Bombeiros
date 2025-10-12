package com.api.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Integer idUsuario;

    @Column(name = "Nome_Usuario", nullable = false)
    private String nomeUsuario;

    @Column(name = "CPF", nullable = false, unique = true)
    private String cpf;

    @Column(name = "Email", nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "Tipo_Usuario", nullable = false)
    private TipoUsuario tipoUsuario;

    @Column(name = "Senha", nullable = false)
    private String senha;

    @Column(name = "Caminho_Foto", nullable = false)
    private String caminhoFoto;

    @Column(name = "Data_Criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "Ultimo_login", nullable = false)
    private LocalDateTime ultimoLogin;

    public enum TipoUsuario {
        Chefe,
        Admin,
        Analista
    }
}
