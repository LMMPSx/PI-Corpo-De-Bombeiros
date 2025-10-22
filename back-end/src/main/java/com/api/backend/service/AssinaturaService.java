//package com.api.backend.service;
//
//import com.api.backend.dto.AssinaturaRequest;
//import com.api.backend.dto.AssinaturaResponse;
//import com.api.backend.model.AssinaturaModel;
//import com.api.backend.repository.AssinaturaRepository;
//import com.api.backend.repository.OcorrenciaRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class AssinaturaService {
//    private final AssinaturaRepository assinaturaRepository;
//    private final OcorrenciaRepository ocorrenciaRepository;
//
//    private AssinaturaResponse toDTO(AssinaturaModel assinatura){
//        String fkOcorrenciaIdString = assinatura.getFkIdOcorrencia() != null
//                ? assinatura.getFkIdOcorrencia().getIdOcorrencia().toString()
//                : null;
//
//        return new AssinaturaResponse(
//                assinatura.getIdAssinatura(),
//                assinatura.getNomeAssinante(),
//                assinatura.getCaminhoAssinatura(),
//                assinatura.getDataAssinatura(),
//                fkOcorrenciaIdString
//        );
//    }
//
//    private AssinaturaModel toModel(AssinaturaRequest assinaturaRequest){
//        var ocorrencia = ocorrenciaRepository.findById(assinaturaRequest.getFkIdOcorrencia())
//                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada para a assinatura."));
//
//        return AssinaturaModel.builder()
//                .nomeAssinante(assinaturaRequest.getNomeAssinante())
//                .caminhoAssinatura(assinaturaRequest.getCaminhoAssinatura())
//                .dataAssinatura(LocalDateTime.now())
//                .fkIdOcorrencia(ocorrencia)
//                .build();
//    }
//
//    public  AssinaturaResponse FindById(Integer id){
//        AssinaturaModel assinatura = assinaturaRepository.findById(id)
//                .orElseThrow(()-> new RuntimeException("Assinatura não encontrada."));
//        return toDTO(assinatura);
//    }
//    public List<AssinaturaResponse> findAll() {
//        return assinaturaRepository.findAll()
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
//    public AssinaturaResponse create(AssinaturaRequest assinaturaRequest) {
//        AssinaturaModel assinatura = toModel(assinaturaRequest);
//        AssinaturaModel assinaturaSalva = assinaturaRepository.save(assinatura);
//        return toDTO(assinaturaSalva);
//    }
//
//    public AssinaturaResponse update(Integer id, AssinaturaRequest assinaturaRequest) {
//        AssinaturaModel assinaturaExistente = assinaturaRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Assinatura não encontrada."));
//
//        if (assinaturaRequest.getCaminhoAssinatura() != null && !assinaturaRequest.getCaminhoAssinatura().trim().isEmpty()) {
//            assinaturaExistente.setCaminhoAssinatura(assinaturaRequest.getCaminhoAssinatura());
//        }
//
//        AssinaturaModel assinaturaAtualizada = assinaturaRepository.save(assinaturaExistente);
//        return toDTO(assinaturaAtualizada);
//    }
//
//    public void delete(Integer id) {
//        if(!assinaturaRepository.existsById(id)) {
//            throw new RuntimeException("Assinatura não encontrada.");
//        }
//        assinaturaRepository.deleteById(id);
//    }
//}
