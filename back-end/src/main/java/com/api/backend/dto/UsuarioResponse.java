package com.api.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Integer id;
    private String nomeUsuario;
    private String cpf;
    private String email;
    private String tipoUsuairo;
    private String caminhoFoto;
    private String dataCriacao;
    private String ultimoLogin;
}
