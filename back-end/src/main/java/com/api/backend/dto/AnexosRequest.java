package com.api.backend.dto;

import com.api.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AnexosRequest {
    private String nomeArquivo;
    private String caminhoArquivo;
    private TipoArquivoModel fkTipoArquivo;
    private OcorrenciaModel fkIdOcorrencia;
}
