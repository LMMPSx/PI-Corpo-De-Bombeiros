//package com.api.backend.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Table(name = "Endereco")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class EnderecoModel {
//    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "ID_Endereco")
//    private Integer idEndereco;
//
//    @Column(name = "CEP", nullable = false)
//    private String cep;
//
//    @Column(name = "Cidade", nullable = false)
//    private String cidade;
//
//    @Column(name = "Bairro", nullable = false)
//    private String bairro;
//
//    @Column(name = "Rua", nullable = false)
//    private String rua;
//
//    @Column(name = "Numero", nullable = false)
//    private String numero;
//
//    @Column(name = "Ponto_Referencia", nullable = false)
//    private String pontoReferencia;
//}
