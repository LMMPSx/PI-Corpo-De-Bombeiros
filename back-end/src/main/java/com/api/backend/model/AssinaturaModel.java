//package com.api.backend.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "Assinatura")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//
//public class AssinaturaModel {
//    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "ID_Assinatura")
//    private Integer idAssinatura;
//
//    @Column(name = "Nome_Assinante")
//    private String nomeAssinante;
//
//    @Column(name = "Caminho_Assinatura")
//    private String caminhoAssinatura;
//
//    @Column(name = "Data_Assinatura", updatable = false)
//    private LocalDateTime dataAssinatura;
//
//    @ManyToOne @JoinColumn(name = "FK_ID_Ocorrencia")
//    private OcorrenciaModel fkIdOcorrencia;
//}
