package com.api.backend.dto;

import com.api.backend.model.UsuarioModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    private String nomeUsuario;
    private String responsavel;
    private String tipoUsuario;
    private String senha;
}
