package com.api.backend.service;

import com.api.backend.dto.AnexosRequest;
import com.api.backend.dto.AnexosResponse;
import com.api.backend.model.AnexosModel;
import com.api.backend.repository.AnexosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnexosService {
    private final AnexosRepository anexosRepository;
    
    private AnexosResponse toDTO(AnexosModel anexosModel){
        return new AnexosResponse(
                anexosModel.getIdAnexos(),
                anexosModel.getNomeArquivo(),
                anexosModel.getCaminhoArquivo(),
                anexosModel.getDataEnvio(),
                anexosModel.getFkTipoArquivo().toString(),
                anexosModel.getFkIdOcorrencia().toString()
        );
    }
    public AnexosResponse findById(Integer id){
        AnexosModel anexos = anexosRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Anexo não encontrado."));
        return toDTO(anexos);
    }
    
    private AnexosModel toModel(AnexosRequest anexosRequest){
        return AnexosModel.builder().nomeArquivo(anexosRequest.getNomeArquivo())
                .caminhoArquivo(anexosRequest.getCaminhoArquivo())
                .fkTipoArquivo(anexosRequest.getFkTipoArquivo())
                .fkIdOcorrencia(anexosRequest.getFkIdOcorrencia())
                .build();
    }

    public List<AnexosResponse> findAll() {
        return anexosRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

    }

    public AnexosResponse create(AnexosRequest AnexosRequest) {
        AnexosModel Anexos = toModel(AnexosRequest);
        AnexosModel AnexosSalva = anexosRepository.save(Anexos);
        return toDTO(AnexosSalva);
    }

    public AnexosResponse update(Integer id, AnexosRequest AnexosRequest) {
        AnexosModel anexosExistente = anexosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anexos não encontrada."));

        anexosExistente.setNomeArquivo(AnexosRequest.getNomeArquivo());
        anexosExistente.setCaminhoArquivo(AnexosRequest.getCaminhoArquivo());

        AnexosModel anexosAtualizado = anexosRepository.save(anexosExistente);
        return toDTO(anexosAtualizado);
    }

    public void delete(Integer id) {
        if(!anexosRepository.existsById(id)) {
            throw new RuntimeException("Anexo não encontrado.");
        }
        anexosRepository.deleteById(id);
    }
}
