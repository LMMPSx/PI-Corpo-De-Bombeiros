package com.api.backend.model;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Tipo_Arquivo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TipoArquivoModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Tipo_Arquivo")
    private Integer idTipoArquivo;

    @Column(name = "Nome_Tipo_Arquivo", nullable = false, unique = true)
    private String nomeTipoArquivo;

    @Column(name = "Descricao_Tipo_Arquivo")
    private String descricaoTipoArquivo;
}
