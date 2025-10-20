package com.api.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Ocorrencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OcorrenciaModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Ocorrencia")
    private Integer idOcorrencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "Natureza_Ocorrencia", nullable = false)
    private NaturezaOcorrencia naturezaOcorrencia;

    @Column(name = "Nome_Solicitante", nullable = false)
    private String nomeSolicitante;

    @Column(name = "Data_Ocorrencia", nullable = false)
    private LocalDate dataOcorrencia;

    @Column(name = "Descricao", nullable = false)
    private String descricao;

    @Column(name = "Localizacao", nullable = false)
    private String localizacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "Prioridade_Ocorrencia", nullable = false)
    private PrioridadeOcorrencia prioridadeOcorrencia;

    @Column(name = "Anexo_Ocorrencia", nullable = false)
    private String anexoOcorrencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status_Ocorrencia", nullable = false)
    private StatusOcorrencia statusOcorrencia;

    @Column(name = "Assinatura_Ocorrencia", nullable = false)
    private String assinaturaOcorrencia;

    public enum NaturezaOcorrencia {
        Urgente,
        Rotina,
        Preventiva
    }

    public enum PrioridadeOcorrencia {
        Baixa,
        Média,
        Alta,
        Urgente
    }

    public enum StatusOcorrencia {
        Aberta,
        Em_Andamento,
        Pendente,
        Resolvida
    }
}
