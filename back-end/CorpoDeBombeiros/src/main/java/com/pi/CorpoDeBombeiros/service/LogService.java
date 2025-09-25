package com.pi.CorpoDeBombeiros.service;

import com.pi.CorpoDeBombeiros.dto.LogDTO;
import com.pi.CorpoDeBombeiros.model.LogModel;
import com.pi.CorpoDeBombeiros.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    private LogDTO toDTO(LogModel log) {
        return new LogDTO(
          log.getIdLog(),
          log.getTipoAlteracao(),
          log.getEntidadeAlterada(),
          log.getAtributoAlterado(),
                log.getValorAntigo(),
                log.getValorNovo(),
                log.getDataAlteracao(),
                log.getFkIdUsuario() != null ? log.getFkIdUsuario().getNomeUsuario() : "Sistema"
        );
    }

    public List<LogDTO> findAll() {
        return logRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LogDTO> findByEntidade(String entidade) {
        return logRepository.findByEntidadeAlterada(entidade)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LogDTO> findByIdUsuario(Integer idUsuario) {
        return logRepository.findByFkIdUsuario_IdUsuario(idUsuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<LogDTO> findByIdUsuario_NomeUsuario(String nomeUsuario) {
        return logRepository.findByFkIdUsuario_NomeUsuario(nomeUsuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
