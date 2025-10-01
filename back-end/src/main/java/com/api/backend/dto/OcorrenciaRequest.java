package com.api.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcorrenciaRequest {
    private String nomeSolicitante;
    private String telefoneSolicitante;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer fkPrioridadeOcorrencia;
    private Integer fkStatusOcorrencia;
    private Integer fkTipoOcorrencia;
    private Integer fkSubtipoOcorrencia;
    private Integer enderecoOcorrencia;
    private Integer fkIdUsuario;
}
