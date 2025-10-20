package com.api.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Anexos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnexosModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Anexo")
    private Integer idAnexos;

    @Column(name = "Nome_Arquivo", nullable = false)
    private String nomeArquivo;

    @Column(name = "Caminho_Arquivo", nullable = false)
    private String caminhoArquivo;

    @Column(name = "Data_Envio", nullable = false, updatable = false)
    private LocalDateTime dataEnvio;

    @ManyToOne @JoinColumn(name = "FK_Tipo_Arquivo")
    private TipoArquivoModel fkTipoArquivo;

    @ManyToOne @JoinColumn(name = "FK_ID_Ocorrencia")
    private OcorrenciaModel fkIdOcorrencia;
    }
