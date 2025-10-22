package com.api.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogModel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Log")
    private Integer idLog;

    @Enumerated(EnumType.STRING)
    @Column(name = "Tipo_Alteracao", nullable = false)
    private TipoAlteracao tipoAlteracao;

    @Column(name = "Entidade_Alterada", nullable = false)
    private String entidadeAlterada;

    @Column(name = "Atributo_Alterado", nullable = false)
    private String atributoAlterado;

    @Column(name = "Valor_Antigo", nullable = false)
    private String valorAntigo;

    @Column(name = "Valor_Novo", nullable = false)
    private String valorNovo;

    @Column(name = "Data_Alteracao", nullable = false)
    private LocalDateTime dataAlteracao;

    // =======================================================
    // ✅ CORREÇÃO: Renomeado de fkIdUsuario para 'usuario'
    // para corresponder ao mappedBy = "usuario" em UsuarioModel.
    // =======================================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FK_ID_Usuario", nullable = false) // Mantém o nome da coluna no DB
    private UsuarioModel usuario; // <-- Nome do campo corrigido

    public enum TipoAlteracao {
        CREATE,
        UPDATE,
        DELETE
    }
}
