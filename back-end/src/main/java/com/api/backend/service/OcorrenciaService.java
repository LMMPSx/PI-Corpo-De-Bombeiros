package com.api.backend.service;

import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.model.OcorrenciaModel;
import com.api.backend.repository.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile; // Novo import
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus; // Novo import para HttpStatus

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;
    // Injete o CloudinaryService para lidar com o upload de arquivos
    private final CloudinaryService cloudinaryService;

    private OcorrenciaResponse toDTO(OcorrenciaModel ocorrencia) {
        return new OcorrenciaResponse(
                ocorrencia.getIdOcorrencia(),
                ocorrencia.getNaturezaOcorrencia().toString(),
                ocorrencia.getNomeSolicitante(),
                ocorrencia.getDataOcorrencia().toString(),
                ocorrencia.getDescricao(),
                ocorrencia.getLocalizacao(),
                ocorrencia.getLatitude(),
                ocorrencia.getLongitude(),
                ocorrencia.getPrioridadeOcorrencia().toString(),
                ocorrencia.getAnexoOcorrencia(),
                ocorrencia.getStatusOcorrencia().toString(),
                ocorrencia.getAssinaturaOcorrencia()

        );
    }

    // Método auxiliar para criar o Model a partir do Request (agora recebe os caminhos dos arquivos)
    private OcorrenciaModel toModel(OcorrenciaRequest ocorrenciaRequest, String anexoPath, String assinaturaPath) {
        return OcorrenciaModel.builder()
                .naturezaOcorrencia(OcorrenciaModel.NaturezaOcorrencia.valueOf(ocorrenciaRequest.getNaturezaOcorrencia()))
                .nomeSolicitante(ocorrenciaRequest.getNomeSolicitante())
                .dataOcorrencia(LocalDateTime.now())
                .descricao(ocorrenciaRequest.getDescricao())
                .localizacao(ocorrenciaRequest.getLocalizacao())
                .latitude(ocorrenciaRequest.getLatitude())
                .longitude(ocorrenciaRequest.getLongitude())
                .prioridadeOcorrencia(OcorrenciaModel.PrioridadeOcorrencia.valueOf(ocorrenciaRequest.getPrioridadeOcorrencia()))
                .anexoOcorrencia(anexoPath) // Usa o caminho do Cloudinary
                .statusOcorrencia(OcorrenciaModel.StatusOcorrencia.valueOf(ocorrenciaRequest.getStatusOcorrencia()))
                .assinaturaOcorrencia(assinaturaPath) // Usa o caminho do Cloudinary
                .build();
    }


    public List<OcorrenciaResponse> findAll() {
        return ocorrenciaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OcorrenciaResponse findById(Integer id) {
        OcorrenciaModel ocorrencia = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));
        return toDTO(ocorrencia);
    }

    public List<OcorrenciaResponse> findByStatus(String status) {
        return ocorrenciaRepository.findByStatusOcorrencia(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<OcorrenciaResponse> findByPrioridade(String nomePrioridade) {
        return ocorrenciaRepository.findByPrioridadeOcorrencia(nomePrioridade)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 🆕 MÉTODO CREATE (agora aceita MultipartFile para anexos)
    public OcorrenciaResponse create(
            OcorrenciaRequest ocorrenciaRequest,
            MultipartFile anexo,
            MultipartFile assinatura
    ) {
        String anexoPath = null;
        String assinaturaPath = null;

        // Gera um ID base para os arquivos no Cloudinary (evitando duplicidade de nomes)
        String basePublicId = "ocorrencia-" + System.currentTimeMillis();
        String folder = "bombeiros/ocorrencias";

        // 1. Upload Anexo
        if (anexo != null && !anexo.isEmpty()) {
            anexoPath = cloudinaryService.uploadFile(anexo, folder, basePublicId + "-anexo");
        }

        // 2. Upload Assinatura
        if (assinatura != null && !assinatura.isEmpty()) {
            assinaturaPath = cloudinaryService.uploadFile(assinatura, folder, basePublicId + "-assinatura");
        }

        // 3. Converte para Model, usando os caminhos obtidos
        OcorrenciaModel ocorrencia = toModel(ocorrenciaRequest, anexoPath, assinaturaPath);

        OcorrenciaModel ocorrenciaSalva = ocorrenciaRepository.save(ocorrencia);
        return toDTO(ocorrenciaSalva);
    }

    // 🆕 MÉTODO UPDATE (agora aceita MultipartFile para anexos)
    public OcorrenciaResponse update(
            Integer id,
            OcorrenciaRequest ocorrenciaRequest,
            MultipartFile anexo,
            MultipartFile assinatura
    ) {
        OcorrenciaModel ocorrenciaExistente = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));

        // Lógica de atualização dos anexos, se novos arquivos foram fornecidos
        String folder = "bombeiros/ocorrencias";
        String basePublicId = "ocorrencia-" + id; // Usa o ID da ocorrência para manter o mesmo Public ID

        // 1. Atualiza Anexo
        if (anexo != null && !anexo.isEmpty()) {
            String novoAnexoPath = cloudinaryService.uploadFile(anexo, folder, basePublicId + "-anexo");
            ocorrenciaExistente.setAnexoOcorrencia(novoAnexoPath);
        }

        // 2. Atualiza Assinatura
        if (assinatura != null && !assinatura.isEmpty()) {
            String novaAssinaturaPath = cloudinaryService.uploadFile(assinatura, folder, basePublicId + "-assinatura");
            ocorrenciaExistente.setAssinaturaOcorrencia(novaAssinaturaPath);
        }

        // Lógica de atualização dos outros campos
        if (ocorrenciaRequest.getNaturezaOcorrencia() != null && !ocorrenciaRequest.getNaturezaOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setNaturezaOcorrencia(OcorrenciaModel.NaturezaOcorrencia.valueOf(ocorrenciaRequest.getNaturezaOcorrencia()));
        }

        if (ocorrenciaRequest.getNomeSolicitante() != null && !ocorrenciaRequest.getNomeSolicitante().trim().isEmpty()) {
            ocorrenciaExistente.setNomeSolicitante(ocorrenciaRequest.getNomeSolicitante());
        }

        if (ocorrenciaRequest.getDescricao() != null && !ocorrenciaRequest.getDescricao().trim().isEmpty()) {
            ocorrenciaExistente.setDescricao(ocorrenciaRequest.getDescricao());
        }

        if (ocorrenciaRequest.getLocalizacao() != null && !ocorrenciaRequest.getLocalizacao().trim().isEmpty()) {
            ocorrenciaExistente.setLocalizacao(ocorrenciaRequest.getLocalizacao());
        }

        if (ocorrenciaRequest.getLatitude() != null) {
            ocorrenciaExistente.setLatitude(ocorrenciaRequest.getLatitude());
        }

        if (ocorrenciaRequest.getLongitude() != null) {
            ocorrenciaExistente.setLongitude(ocorrenciaRequest.getLongitude());
        }

        if (ocorrenciaRequest.getPrioridadeOcorrencia() != null && !ocorrenciaRequest.getPrioridadeOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setPrioridadeOcorrencia(OcorrenciaModel.PrioridadeOcorrencia.valueOf(ocorrenciaRequest.getPrioridadeOcorrencia()));
        }

        if (ocorrenciaRequest.getStatusOcorrencia() != null && !ocorrenciaRequest.getStatusOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setStatusOcorrencia(OcorrenciaModel.StatusOcorrencia.valueOf(ocorrenciaRequest.getStatusOcorrencia()));
        }

        // Note: anexoOcorrencia e assinaturaOcorrencia são atualizados via MultipartFile acima.

        OcorrenciaModel ocorrenciaAtualizada = ocorrenciaRepository.save(ocorrenciaExistente);
        return toDTO(ocorrenciaAtualizada);
    }

    public void delete(Integer id) {
        if(!ocorrenciaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada");
        }
        ocorrenciaRepository.deleteById(id);
    }
}
