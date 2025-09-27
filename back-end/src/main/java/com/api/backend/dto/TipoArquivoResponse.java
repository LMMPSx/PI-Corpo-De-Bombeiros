package com.api.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoArquivoResponse {
    private Integer idTipoArquivo;
    private String nomeTipoArquivo;
    private String descricaoTipoArquivo;
}
