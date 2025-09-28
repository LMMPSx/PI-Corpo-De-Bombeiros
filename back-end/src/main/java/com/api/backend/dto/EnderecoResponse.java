package com.api.backend.dto;

import com.api.backend.model.OcorrenciaModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class EnderecoResponse {
    private Integer idEndereco;
    private String cep;
    private String cidade;
    private String bairro;
    private String rua;
    private String numero;
    private String pontoReferencia;
}