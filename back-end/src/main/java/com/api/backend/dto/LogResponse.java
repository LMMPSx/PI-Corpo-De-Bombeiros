package com.api.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogResponse {
    private Integer idLog;
    private String tipoAlteracao;
    private String entidadeAlterada;
    private String atributoAlterado;
    private String valorAntigo;
    private String valorNovo;
    private LocalDateTime dataAlteracao;
    private String usuarioResponsavel;
}
