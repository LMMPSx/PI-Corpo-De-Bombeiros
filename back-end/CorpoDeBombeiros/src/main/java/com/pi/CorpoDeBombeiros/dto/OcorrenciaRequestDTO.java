package com.pi.CorpoDeBombeiros.dto;

import com.pi.CorpoDeBombeiros.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OcorrenciaRequestDTO {
    private String nomeSolicitante;
    private String telefoneSolicitante;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private PrioridadeOcorrenciaModel fkPrioridadeOcorrencia;
    private StatusOcorrenciaModel fkStatusOcorrencia;
    private TipoOcorrenciaModel fkTipoOcorrencia;
    private SubtipoOcorrenciaModel fkSubtipoOcorrencia;
    private EnderecoModel enderecoOcorrencia;
    private UsuarioModel fkIdUsuario;
}
