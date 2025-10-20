package com.api.backend.service;

import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByNomeUsuario("admin").isEmpty()) {
            UsuarioModel admin = UsuarioModel.builder()
                    .nomeUsuario("admin")
                    .cpf("Administrador do Sistema")
                    .email("admin.teste@gmail.com")
                    .tipoUsuario(UsuarioModel.TipoUsuario.Admin)
                    .senha(passwordEncoder.encode("admin"))
                    .caminhoFoto("fotos/admin.png")
                    .dataCriacao(LocalDateTime.now())
                    .build();
            usuarioRepository.save(admin);
        }

        if (usuarioRepository.findByNomeUsuario("joao").isEmpty()) {
            UsuarioModel joao = UsuarioModel.builder()
                    .nomeUsuario("joao")
                    .cpf("João da Silva")
                    .email("joao.silva@gmail.com")
                    .tipoUsuario(UsuarioModel.TipoUsuario.Analista)
                    .senha(passwordEncoder.encode("123456"))
                    .caminhoFoto("fotos/analista.png")
                    .dataCriacao(LocalDateTime.now())
                    .build();
            usuarioRepository.save(joao);
        }
    }
}
