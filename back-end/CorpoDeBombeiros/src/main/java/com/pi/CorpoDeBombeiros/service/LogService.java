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

    public List<LogDTO> findByUsuario(String usuario) {
        return logRepository.findByUsuario(usuario)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
