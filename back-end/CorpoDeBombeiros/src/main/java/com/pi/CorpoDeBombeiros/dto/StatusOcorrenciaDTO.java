package com.pi.CorpoDeBombeiros.dto;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusOcorrenciaDTO {
    private Integer idStatus;
    private String nomeStatus;
}
