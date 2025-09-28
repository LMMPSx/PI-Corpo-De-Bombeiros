package com.api.backend.dto;

import com.api.backend.model.OcorrenciaModel;
import com.api.backend.model.TipoArquivoModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AssinaturaResponse {
    private Integer idAssinatura;
    private String nomeAssinante;
    private String caminhoAssinatura;
    private LocalDateTime dataAssinatura;
    private String fkIdOcorrencia;
}