//package com.api.backend.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.util.List;
//
//@Entity
//@Table(name = "Tipo_Ocorrencia")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class TipoOcorrenciaModel {
//    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "ID_Tipo")
//    private Integer idTipo;
//
//    @Column(name = "Nome_Tipo", nullable = false)
//    private String nomeTipo;
//
//    @Column(name = "Descricao_Tipo")
//    private String descricaoTipo;
//
//    @OneToMany(mappedBy = "idSubtipo")
//    private List<SubtipoOcorrenciaModel> fkIdSubtipo;
//}
