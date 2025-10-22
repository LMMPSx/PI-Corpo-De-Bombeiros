package com.api.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// ✅ Reintroduzido: Necessário para a segurança JWT/Spring Security
public class UsuarioModel implements UserDetails {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Integer idUsuario;

    @Column(name = "Nome_Usuario", nullable = false)
    private String nomeUsuario;

    @Column(name = "CPF", nullable = false, unique = true)
    private String cpf;

    @Column(name = "Email", nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "Tipo_Usuario", nullable = false)
    private TipoUsuario tipoUsuario;

    @Column(name = "Senha", nullable = false)
    private String senha;

    @Column(name = "Caminho_Foto")
    private String caminhoFoto;

    @Column(name = "Data_Criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "Ultimo_login", nullable = false)
    private LocalDateTime ultimoLogin;

    // =======================================================
    // ✅ CORREÇÃO CRÍTICA PARA FOREIGN KEY: DELETE EM CASCATA
    //
    // Esta configuração instrui o JPA/Hibernate a:
    // 1. Deletar os registros de log (CascadeType.ALL)
    // 2. Antes de deletar o usuário pai.
    // O 'mappedBy = "usuario"' pressupõe que sua classe LogModel tem um campo
    // 'usuario' anotado com @ManyToOne.
    // =======================================================
    @OneToMany(mappedBy = "usuario",
            cascade = CascadeType.ALL, // <-- Resolve o SQLIntegrityConstraintViolationException
            orphanRemoval = true)
    // Se você tiver outras entidades filhas (ex: OcorrenciaModel),
    // você precisa adicionar relacionamentos semelhantes aqui.
    private List<LogModel> logs;

    public enum TipoUsuario {
        Chefe,
        Admin,
        Analista
    }

    // =======================================================
    // ✅ MÉTODOS UserDetails (Necessário para JWT/Security)
    // =======================================================
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + tipoUsuario.name()));
    }

    @Override
    public String getPassword() {
        // Retorna a senha real para ser comparada pelo Spring Security
        return senha;
    }

    @Override
    public String getUsername() {
        // Usa o CPF como nome de usuário
        return cpf;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
