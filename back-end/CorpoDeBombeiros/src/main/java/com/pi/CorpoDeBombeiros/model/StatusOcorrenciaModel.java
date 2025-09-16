package com.pi.CorpoDeBombeiros.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Status_Ocorrencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusOcorrenciaModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Status")
    private long idStatus;

    @Column(name = "Nome_Status", nullable = false)
    private String nomeStatus;
}
