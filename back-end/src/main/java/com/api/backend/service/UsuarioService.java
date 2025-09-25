package com.api.backend.service;

import com.api.backend.dto.UsuarioResponse;
import com.api.backend.dto.UsuarioRequest;
import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private UsuarioResponse toDTO(UsuarioModel usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario(),
                usuario.getResponsavel(),
                usuario.getDataCriacao().toString()
        );
    }

    private UsuarioModel toModel(UsuarioRequest usuarioResquest) {
        return UsuarioModel.builder()
                .nomeUsuario(usuarioResquest.getNomeUsuario())
                .responsavel(usuarioResquest.getResponsavel())
                .dataCriacao(LocalDate.now())
                .build();
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
        UsuarioModel usuario = toModel(usuarioRequest);
        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return toDTO(usuarioSalvo);
    }

    public UsuarioResponse update(Integer id, UsuarioRequest usuarioRequest) {
        UsuarioModel usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        usuarioExistente.setNomeUsuario(usuarioRequest.getNomeUsuario());
        usuarioExistente.setResponsavel(usuarioRequest.getResponsavel());

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