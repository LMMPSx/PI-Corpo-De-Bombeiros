package com.api.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Prioridade_Ocorrencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrioridadeOcorrenciaModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Prioridade")
    private Integer idPrioridade;

    @Column(name = "Nome_Prioridade", nullable = false)
    private String nomePrioridade;
}
