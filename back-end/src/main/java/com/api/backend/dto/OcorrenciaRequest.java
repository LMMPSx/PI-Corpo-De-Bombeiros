package com.api.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcorrenciaRequest {
    private String naturezaOcorrencia;
    private String nomeSolicitante;
    private String descricao;
    private String localizacao;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String prioridadeOcorrencia;
    private String anexoOcorrencia;
    private String statusOcorrencia;
    private String assinaturaOcorrencia;
}
