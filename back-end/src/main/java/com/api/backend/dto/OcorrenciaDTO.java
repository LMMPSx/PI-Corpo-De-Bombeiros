package com.api.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcorrenciaDTO {
    private Integer idOcorrencia;
    private String nomeSolicitante;
    private String telefoneSolicitante;
    private LocalDateTime dataOcorrencia;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String fkPrioridadeOcorrencia;
    private String fkStatusOcorrencia;
    private String fkTipoOcorrencia;
    private String fkSubtipoOcorrencia;
    private String fkenderecoOcorrencia;
    private String usuarioReponsavel;
}
