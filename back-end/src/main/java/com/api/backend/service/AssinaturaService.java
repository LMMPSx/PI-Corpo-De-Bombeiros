package com.api.backend.service;

import com.api.backend.dto.AssinaturaRequest;
import com.api.backend.dto.AssinaturaResponse;
import com.api.backend.dto.UsuarioDTO;
import com.api.backend.dto.UsuarioRequestDTO;
import com.api.backend.model.AssinaturaModel;
import com.api.backend.model.UsuarioModel;
import com.api.backend.repository.AssinaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssinaturaService {
    private final AssinaturaRepository assinaturaRepository;

    private AssinaturaResponse toDTO(AssinaturaModel nomeAssinante){
        return new AssinaturaResponse(
                nomeAssinante.getIdAssinatura(),
                nomeAssinante.getNomeAssinante(),
                nomeAssinante.getCaminhoAssinatura(),
                nomeAssinante.getDataAssinatura(),
                nomeAssinante.getFkIdOcorrencia().toString()
        );
    }

    private AssinaturaModel toModel(AssinaturaRequest assinaturaRequest){
        return AssinaturaModel.builder()
                .nomeAssinante(assinaturaRequest.getNomeAssinante())
                .caminhoAssinatura(assinaturaRequest.getCaminhoAssinatura())
                .build();
    }

    public  AssinaturaResponse FindById(Integer id){
        AssinaturaModel assinatura = assinaturaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Assinatura não encontrada."));
        return toDTO(assinatura);
    }
    public List<AssinaturaResponse> findAll() {
        return assinaturaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    public AssinaturaResponse create(AssinaturaRequest assinaturaRequest) {
        AssinaturaModel assinatura = toModel(assinaturaRequest);
        AssinaturaModel assinaturaSalva = assinaturaRepository.save(assinatura);
        return toDTO(assinaturaSalva);
    }

    public AssinaturaResponse update(Integer id, AssinaturaRequest assinaturaRequest) {
        AssinaturaModel assinaturaExistente = assinaturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assinatura não encontrada."));

        assinaturaExistente.setNomeAssinante(assinaturaRequest.getNomeAssinante());
        assinaturaExistente.setCaminhoAssinatura(assinaturaRequest.getCaminhoAssinatura());

        AssinaturaModel assinaturaAtualizada = assinaturaRepository.save(assinaturaExistente);
        return toDTO(assinaturaAtualizada);
    }

    public void delete(Integer id) {
        if(!assinaturaRepository.existsById(id)) {
            throw new RuntimeException("Assinatura não encontrada.");
        }
        assinaturaRepository.deleteById(id);
    }
}
