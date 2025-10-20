package com.api.backend.service;

import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByCpf("0000").isEmpty()) {
            UsuarioModel admin = UsuarioModel.builder()
                    .nomeUsuario("admin")
                    .cpf("0000")
                    .email("admin.teste@gmail.com")
                    .tipoUsuario(UsuarioModel.TipoUsuario.Admin)
                    .senha(passwordEncoder.encode("admin"))
                    .caminhoFoto("fotos/admin.png")
                    .dataCriacao(LocalDateTime.now())
                    .build();
            usuarioRepository.save(admin);
        }

        if (usuarioRepository.findByCpf("1111").isEmpty()) {
            UsuarioModel joao = UsuarioModel.builder()
                    .nomeUsuario("joao")
                    .cpf("1111")
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
