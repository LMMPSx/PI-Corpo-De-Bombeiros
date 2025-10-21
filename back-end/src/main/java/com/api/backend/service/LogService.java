package com.api.backend.service;

import com.api.backend.dto.LogResponse;
import com.api.backend.model.LogModel;
import com.api.backend.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    private LogResponse toDTO(LogModel log) {
        return new LogResponse(
          log.getIdLog(),
          log.getTipoAlteracao().toString(),
          log.getEntidadeAlterada(),
          log.getAtributoAlterado(),
                log.getValorAntigo(),
                log.getValorNovo(),
                log.getDataAlteracao(),
                log.getFkIdUsuario() != null ? log.getFkIdUsuario().getNomeUsuario() : "Sistema"
        );
    }

    public List<LogResponse> findAll() {
        return logRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LogResponse> findByEntidade(String entidade) {
        return logRepository.findByEntidadeAlterada(entidade)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LogResponse> findByIdUsuario(Integer idUsuario) {
        return logRepository.findByFkIdUsuario_IdUsuario(idUsuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LogResponse> findByIdUsuario_NomeUsuario(String nomeUsuario) {
        return logRepository.findByFkIdUsuario_NomeUsuario(nomeUsuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
