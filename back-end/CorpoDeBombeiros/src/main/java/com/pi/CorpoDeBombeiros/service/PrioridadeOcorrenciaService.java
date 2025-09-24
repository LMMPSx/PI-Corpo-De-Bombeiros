package com.pi.CorpoDeBombeiros.service;

import com.pi.CorpoDeBombeiros.dto.PrioridadeOcorrenciaDTO;
import com.pi.CorpoDeBombeiros.model.PrioridadeOcorrenciaModel;
import com.pi.CorpoDeBombeiros.repository.PrioridadeOcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrioridadeOcorrenciaService {

    private final PrioridadeOcorrenciaRepository prioridadeOcorrenciaRepository;

    public PrioridadeOcorrenciaDTO toDTO(PrioridadeOcorrenciaModel prioridade) {
        return new PrioridadeOcorrenciaDTO(prioridade.getIdPrioridade(), prioridade.getNomePrioridade());
    }

    public List<PrioridadeOcorrenciaDTO> findAll() {
        return prioridadeOcorrenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PrioridadeOcorrenciaDTO findById(Integer id) {
        PrioridadeOcorrenciaModel prioridade = prioridadeOcorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prioridade não encontrada"));
        return toDTO(prioridade);
    }
}
