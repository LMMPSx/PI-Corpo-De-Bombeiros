package com.pi.CorpoDeBombeiros.service;

import com.pi.CorpoDeBombeiros.dto.UsuarioDTO;
import com.pi.CorpoDeBombeiros.dto.UsuarioRequestDTO;
import com.pi.CorpoDeBombeiros.model.UsuarioModel;
import com.pi.CorpoDeBombeiros.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private UsuarioDTO toDTO(UsuarioModel usuario) {
        return new UsuarioDTO(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario(),
                usuario.getResponsavel(),
                usuario.getDataCriacao().toString()
        );
    }

    private UsuarioModel toModel(UsuarioRequestDTO usuarioResquest) {
        return UsuarioModel.builder()
                .nomeUsuario(usuarioResquest.getNomeUsuario())
                .responsavel(usuarioResquest.getResponsavel())
                .dataCriacao(LocalDate.now())
                .build();
    }

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO findById(Integer id) {
        UsuarioModel usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
        return toDTO(usuario);
    }

    public UsuarioDTO create(UsuarioRequestDTO usuarioRequest) {
        UsuarioModel usuario = toModel(usuarioRequest);
        UsuarioModel usuarioSalvo = usuarioRepository.save(usuario);
        return toDTO(usuarioSalvo);
    }

    public UsuarioDTO update(Integer id, UsuarioRequestDTO usuarioRequest) {
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