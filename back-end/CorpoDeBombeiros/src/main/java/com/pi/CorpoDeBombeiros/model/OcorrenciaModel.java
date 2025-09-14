package com.pi.CorpoDeBombeiros.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Ocorrencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OcorrenciaModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Ocorrencia")
    private long idOcorrencia;

    @Column(name = "Nome_Solicitante", nullable = false)
    private String nomeSolicitante;

    @Column(name = "Telefone_Solicitante", nullable = false)
    private String telefoneSolicitante;

    @Column(name = "Data_Ocorrencia", nullable = false)
    private LocalDateTime dataOcorrencia;

    @Column(name = "Latitude", nullable = false, precision = 10, scale = 8)
    private Double latitude;

    @Column(name = "Longitude", nullable = false, precision = 11, scale = 8)
    private Double longitude;

    @ManyToOne @JoinColumn(name = "FK_Prioridade_Ocorrencia")
    private PrioridadeOcorrenciaModel fkPrioridadeOcorrencia;

    @ManyToOne @JoinColumn(name = "FK_Status_Ocorrencia")
    private StatusOcorrenciaModel fkStatusOcorrencia;

    @ManyToOne @JoinColumn(name = "FK_Tipo_Ocorrencia")
    private TipoOcorrenciaModel fkTipoOcorrencia;

    @ManyToOne @JoinColumn(name = "FK_Subtipo_Ocorrencia")
    private SubtipoOcorrenciaModel fkSubtiboOcorrencia;

    @ManyToOne @JoinColumn(name = "Endereco_Ocorrencia")
    private EnderecoModel enderecoOcorrencia;

    @ManyToOne @JoinColumn(name = "FK_ID_Usuario")
    private UsuarioModel fkIdUsuario;

//  Erro por não existir a classe AnexosModel
    @OneToMany(mappedBy = "Ocorrencia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnexosModel> anexos;
//  Erro por não existir a classe AssinaturaModel
    @OneToMany(mappedBy = "Ocorrencia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssinaturaModel> assinatura;
}
