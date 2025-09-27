package com.api.backend.dto;

import com.api.backend.model.OcorrenciaModel;
import com.api.backend.model.TipoArquivoModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AssinaturaRequest {
    private String nomeAssinante;
    private String caminhoAssinatura;
    private OcorrenciaModel fkIdOcorrencia;
}
