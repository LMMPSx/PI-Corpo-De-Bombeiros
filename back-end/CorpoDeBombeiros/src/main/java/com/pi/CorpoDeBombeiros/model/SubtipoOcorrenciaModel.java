package com.pi.CorpoDeBombeiros.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Subtipo_Ocorrencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubtipoOcorrenciaModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Subtipo")
    private Integer idSubtipo;

    @Column(name = "Nome_Subtipo",nullable = false)
    private String nomeSubtipo;

    @Column(name = "Descricao_Subtipo")
    private String descricaoSubtipo;
}
