package com.api.backend.service;

import com.api.backend.dto.EnderecoRequest;
import com.api.backend.dto.EnderecoResponse;
import com.api.backend.dto.OcorrenciaResponse;
import com.api.backend.dto.OcorrenciaRequest;
import com.api.backend.model.EnderecoModel;
import com.api.backend.model.OcorrenciaModel;
import com.api.backend.repository.OcorrenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepository;
    private final CloudinaryService cloudinaryService;

    private EnderecoResponse toEnderecoDTO(EnderecoModel model) {
        if (model == null) return null;
        // Assume-se que EnderecoResponse utiliza o padrão AllArgsConstructor para esta estrutura
        return new EnderecoResponse(
                model.getIdEndereco(),
                model.getCep(),
                model.getEstado(),
                model.getCidade(),
                model.getBairro(),
                model.getRua(),
                model.getNumero(),
                model.getComplemento(),
                model.getLatitude(),
                model.getLongitude()
        );
    }

    private OcorrenciaResponse toDTO(OcorrenciaModel ocorrencia) {
        // CORREÇÃO: Usando construtor da OcorrenciaResponse (assume-se AllArgsConstructor ou construtor completo)
        return new OcorrenciaResponse(
                ocorrencia.getIdOcorrencia(),
                ocorrencia.getNaturezaOcorrencia().toString(),
                ocorrencia.getNomeSolicitante(),
                ocorrencia.getDataOcorrencia().toString(),
                ocorrencia.getDescricao(),
                ocorrencia.getPrioridadeOcorrencia().toString(),
                ocorrencia.getAnexoOcorrencia(),
                ocorrencia.getStatusOcorrencia().toString(),
                ocorrencia.getAssinaturaOcorrencia(),
                toEnderecoDTO(ocorrencia.getEndereco()) // Relacionamento adicionado
        );
    }

    // Método auxiliar para criar o Model a partir do Request (agora recebe os caminhos dos arquivos e mapeia o endereço)
    private OcorrenciaModel toModel(OcorrenciaRequest ocorrenciaRequest, String anexoPath, String assinaturaPath) {
        // 1. Mapeia EnderecoRequest para EnderecoModel
        EnderecoModel enderecoModel = EnderecoModel.builder()
                .cep(ocorrenciaRequest.getEndereco().getCep())
                .estado(ocorrenciaRequest.getEndereco().getEstado())
                .cidade(ocorrenciaRequest.getEndereco().getCidade())
                .bairro(ocorrenciaRequest.getEndereco().getBairro())
                .rua(ocorrenciaRequest.getEndereco().getRua())
                .numero(ocorrenciaRequest.getEndereco().getNumero())
                .complemento(ocorrenciaRequest.getEndereco().getComplemento())
                .latitude(ocorrenciaRequest.getEndereco().getLatitude())
                .longitude(ocorrenciaRequest.getEndereco().getLongitude())
                .build();

        // 2. Mapeia OcorrenciaRequest para OcorrenciaModel
        return OcorrenciaModel.builder()
                .naturezaOcorrencia(OcorrenciaModel.NaturezaOcorrencia.valueOf(ocorrenciaRequest.getNaturezaOcorrencia()))
                .nomeSolicitante(ocorrenciaRequest.getNomeSolicitante())
                .dataOcorrencia(LocalDateTime.now())
                .descricao(ocorrenciaRequest.getDescricao())
                .prioridadeOcorrencia(OcorrenciaModel.PrioridadeOcorrencia.valueOf(ocorrenciaRequest.getPrioridadeOcorrencia()))
                .anexoOcorrencia(anexoPath)
                .statusOcorrencia(OcorrenciaModel.StatusOcorrencia.valueOf(ocorrenciaRequest.getStatusOcorrencia()))
                .assinaturaOcorrencia(assinaturaPath)
                .endereco(enderecoModel) // Anexa o EnderecoModel
                .build();
    }


    public List<OcorrenciaResponse> findAll() {
        return ocorrenciaRepository.findAllWithEndereco() // <--- MUDANÇA CRUCIAL AQUI
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OcorrenciaResponse findById(Integer id) {
        OcorrenciaModel ocorrencia = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));
        return toDTO(ocorrencia);
    }

    // CORREÇÃO: Passando o status como String, evitando conversão para Enum no Service
    public List<OcorrenciaResponse> findByStatus(String status) {
        return ocorrenciaRepository.findByStatusOcorrencia(status)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // CORREÇÃO: Passando a prioridade como String, evitando conversão para Enum no Service
    public List<OcorrenciaResponse> findByPrioridade(String nomePrioridade) {
        return ocorrenciaRepository.findByPrioridadeOcorrencia(nomePrioridade)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // MÉTODO CREATE (agora aceita MultipartFile para anexos e mapeia o endereço)
    public OcorrenciaResponse create(
            OcorrenciaRequest ocorrenciaRequest,
            MultipartFile anexo,
            MultipartFile assinatura
    ) {
        String anexoPath = null;
        String assinaturaPath = null;

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

        // 3. Converte para Model, usando os caminhos obtidos e o EnderecoRequest aninhado
        OcorrenciaModel ocorrencia = toModel(ocorrenciaRequest, anexoPath, assinaturaPath);

        OcorrenciaModel ocorrenciaSalva = ocorrenciaRepository.save(ocorrencia);
        return toDTO(ocorrenciaSalva);
    }

    // MÉTODO UPDATE (agora aceita MultipartFile para anexos e atualiza o endereço)
    public OcorrenciaResponse update(
            Integer id,
            OcorrenciaRequest ocorrenciaRequest,
            MultipartFile anexo,
            MultipartFile assinatura
    ) {
        OcorrenciaModel ocorrenciaExistente = ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));

        // Lógica de atualização dos anexos
        String folder = "bombeiros/ocorrencias";
        String basePublicId = "ocorrencia-" + id;

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

        // 3. Atualização dos campos da OCORRÊNCIA
        if (ocorrenciaRequest.getNaturezaOcorrencia() != null && !ocorrenciaRequest.getNaturezaOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setNaturezaOcorrencia(OcorrenciaModel.NaturezaOcorrencia.valueOf(ocorrenciaRequest.getNaturezaOcorrencia()));
        }
        if (ocorrenciaRequest.getNomeSolicitante() != null && !ocorrenciaRequest.getNomeSolicitante().trim().isEmpty()) {
            ocorrenciaExistente.setNomeSolicitante(ocorrenciaRequest.getNomeSolicitante());
        }
        if (ocorrenciaRequest.getDescricao() != null && !ocorrenciaRequest.getDescricao().trim().isEmpty()) {
            ocorrenciaExistente.setDescricao(ocorrenciaRequest.getDescricao());
        }
        if (ocorrenciaRequest.getPrioridadeOcorrencia() != null && !ocorrenciaRequest.getPrioridadeOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setPrioridadeOcorrencia(OcorrenciaModel.PrioridadeOcorrencia.valueOf(ocorrenciaRequest.getPrioridadeOcorrencia()));
        }
        if (ocorrenciaRequest.getStatusOcorrencia() != null && !ocorrenciaRequest.getStatusOcorrencia().trim().isEmpty()) {
            ocorrenciaExistente.setStatusOcorrencia(OcorrenciaModel.StatusOcorrencia.valueOf(ocorrenciaRequest.getStatusOcorrencia()));
        }

        // 4. Atualizar campos do EnderecoModel associado (Lógica de PATCH)
        EnderecoRequest enderecoRequest = ocorrenciaRequest.getEndereco();
        EnderecoModel enderecoExistente = ocorrenciaExistente.getEndereco();

        if (enderecoRequest != null && enderecoExistente != null) {
            // Atualiza campos String
            if (enderecoRequest.getCep() != null && !enderecoRequest.getCep().trim().isEmpty()) {
                enderecoExistente.setCep(enderecoRequest.getCep());
            }
            if (enderecoRequest.getEstado() != null && !enderecoRequest.getEstado().trim().isEmpty()) {
                enderecoExistente.setEstado(enderecoRequest.getEstado());
            }
            // ... (restante dos campos String)
            if (enderecoRequest.getCidade() != null && !enderecoRequest.getCidade().trim().isEmpty()) {
                enderecoExistente.setCidade(enderecoRequest.getCidade());
            }
            if (enderecoRequest.getBairro() != null && !enderecoRequest.getBairro().trim().isEmpty()) {
                enderecoExistente.setBairro(enderecoRequest.getBairro());
            }
            if (enderecoRequest.getRua() != null && !enderecoRequest.getRua().trim().isEmpty()) {
                enderecoExistente.setRua(enderecoRequest.getRua());
            }
            if (enderecoRequest.getNumero() != null && !enderecoRequest.getNumero().trim().isEmpty()) {
                enderecoExistente.setNumero(enderecoRequest.getNumero());
            }
            if (enderecoRequest.getComplemento() != null && !enderecoRequest.getComplemento().trim().isEmpty()) {
                enderecoExistente.setComplemento(enderecoRequest.getComplemento());
            }
            // Atualiza campos BigDecimal
            if (enderecoRequest.getLatitude() != null) {
                enderecoExistente.setLatitude(enderecoRequest.getLatitude());
            }
            if (enderecoRequest.getLongitude() != null) {
                enderecoExistente.setLongitude(enderecoRequest.getLongitude());
            }
        }

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
