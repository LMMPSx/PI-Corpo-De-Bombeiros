package com.api.backend.service;

import com.api.backend.dto.AnexosRequest;
import com.api.backend.dto.AnexosResponse;
import com.api.backend.model.AnexosModel;
import com.api.backend.repository.AnexosRepository;
import com.api.backend.repository.OcorrenciaRepository;
import com.api.backend.repository.TipoArquivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnexosService {
    private final AnexosRepository anexosRepository;
    private final OcorrenciaRepository ocorrenciaRepository;
    private final TipoArquivoRepository tipoArquivoRepository;

    private AnexosResponse toDTO(AnexosModel anexosModel){
        String fkTipoArquivoIdString = anexosModel.getFkTipoArquivo() != null
                ? anexosModel.getFkTipoArquivo().getIdTipoArquivo().toString()
                : null;

        String fkOcorrenciaIdString = anexosModel.getFkIdOcorrencia() != null
                ? anexosModel.getFkIdOcorrencia().getIdOcorrencia().toString()
                : null;

        return new AnexosResponse(
                anexosModel.getIdAnexos(),
                anexosModel.getNomeArquivo(),
                anexosModel.getCaminhoArquivo(),
                anexosModel.getDataEnvio(),
                fkTipoArquivoIdString,
                fkOcorrenciaIdString
        );
    }

    private AnexosModel toModel(AnexosRequest anexosRequest){
        // Busca a entidade TipoArquivo pelo ID
        var tipoArquivo = tipoArquivoRepository.findById(anexosRequest.getFkTipoArquivo())
                .orElseThrow(() -> new RuntimeException("Tipo de Arquivo não encontrado."));

        // Busca a entidade Ocorrencia pelo ID
        var ocorrencia = ocorrenciaRepository.findById(anexosRequest.getFkIdOcorrencia())
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada."));

        return AnexosModel.builder()
                .nomeArquivo(anexosRequest.getNomeArquivo())
                .caminhoArquivo(anexosRequest.getCaminhoArquivo())
                .dataEnvio(LocalDateTime.now()) // Define a data de criação (Imutável)
                .fkTipoArquivo(tipoArquivo)
                .fkIdOcorrencia(ocorrencia)
                .build();
    }

    public List<AnexosResponse> findAll() {
        return anexosRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

    }

    public AnexosResponse create(AnexosRequest anexosRequest) {
        AnexosModel anexos = toModel(anexosRequest);
        AnexosModel anexosSalvo = anexosRepository.save(anexos);
        return toDTO(anexosSalvo);
    }

    public AnexosResponse update(Integer id, AnexosRequest anexosRequest) {
        AnexosModel anexosExistente = anexosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anexo não encontrado."));

        if (anexosRequest.getNomeArquivo() != null && !anexosRequest.getNomeArquivo().trim().isEmpty()) {
            anexosExistente.setNomeArquivo(anexosRequest.getNomeArquivo());
        }

        if (anexosRequest.getCaminhoArquivo() != null && !anexosRequest.getCaminhoArquivo().trim().isEmpty()) {
            anexosExistente.setCaminhoArquivo(anexosRequest.getCaminhoArquivo());
        }

        if (anexosRequest.getFkTipoArquivo() != null) {
            var tipoArquivo = tipoArquivoRepository.findById(anexosRequest.getFkTipoArquivo())
                    .orElseThrow(() -> new RuntimeException("Tipo de Arquivo não encontrado."));
            anexosExistente.setFkTipoArquivo(tipoArquivo);
        }

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
