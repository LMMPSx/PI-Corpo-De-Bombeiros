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

public class AnexosResponse {
    private Integer idAnexos;
    private String nomeArquivo;
    private String caminhoArquivo;
    private LocalDateTime dataEnvio;
    private String fkTipoArquivo;
    private String fkIdOcorrencia;
}
