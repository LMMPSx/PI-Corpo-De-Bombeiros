package com.api.backend.service;

import com.api.backend.dto.UsuarioResponse;
import com.api.backend.dto.UsuarioRequest;
import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private UsuarioResponse toDTO(UsuarioModel usuario) {
        String ultimoLoginString = usuario.getUltimoLogin() != null
                ? usuario.getUltimoLogin().toString()
                : "N/A - Novo Usuário";
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario(),
                usuario.getResponsavel(),
                usuario.getTipoUsuario().toString(),
                usuario.getDataCriacao().toString(),
                ultimoLoginString
        );
    }

    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioResponse findById(Integer id) {
        UsuarioModel usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
        return toDTO(usuario);
    }

    public UsuarioResponse create(UsuarioRequest usuarioRequest) {
        String senhaCriptografada = passwordEncoder.encode(usuarioRequest.getSenha());

        UsuarioModel usuario = UsuarioModel.builder()
                .nomeUsuario(usuarioRequest.getNomeUsuario())
                .responsavel(usuarioRequest.getResponsavel())
                .tipoUsuario(UsuarioModel.TipoUsuario.valueOf(usuarioRequest.getTipoUsuario()))
                .senha(senhaCriptografada)
                .dataCriacao(LocalDateTime.now())
                .build();

        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return toDTO(usuarioSalvo);
    }

    public UsuarioResponse update(Integer id, UsuarioRequest usuarioRequest) {

        UsuarioModel usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        usuarioExistente.setNomeUsuario(usuarioRequest.getNomeUsuario());
        usuarioExistente.setResponsavel(usuarioRequest.getResponsavel());

        if (usuarioRequest.getTipoUsuario() != null && !usuarioRequest.getTipoUsuario().isEmpty()) {
            usuarioExistente.setTipoUsuario(UsuarioModel.TipoUsuario.valueOf(usuarioRequest.getTipoUsuario()));
        }

        if (usuarioRequest.getSenha() != null && !usuarioRequest.getSenha().isEmpty()) {
            String novaSenhaCriptografada = passwordEncoder.encode(usuarioRequest.getSenha());
            usuarioExistente.setSenha(novaSenhaCriptografada);
        }

        UsuarioModel usuarioAtualizado = usuarioRepository.save(usuarioExistente);
        return toDTO(usuarioAtualizado);
    }

    public void delete(Integer id) {
        if(!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario não encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}