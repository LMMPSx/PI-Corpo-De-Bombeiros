//package com.api.backend.service;
//
//import com.api.backend.dto.TipoArquivoResponse;
//import com.api.backend.model.TipoArquivoModel;
//import com.api.backend.repository.TipoArquivoRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.w3c.dom.css.ElementCSSInlineStyle;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class TipoArquivoService {
//
//    @Autowired
//    private final TipoArquivoRepository tipoArquivoRepository;
//
//    private TipoArquivoResponse toDTO(TipoArquivoModel tipoArquivo){
//        return new TipoArquivoResponse(
//                tipoArquivo.getIdTipoArquivo(),
//                tipoArquivo.getNomeTipoArquivo(),
//                tipoArquivo.getDescricaoTipoArquivo()
//        );
//    }
//    public List<TipoArquivoResponse> findAll(){
//        return tipoArquivoRepository.findAll()
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//
//    }
//    public TipoArquivoResponse findById(Integer id){
//        TipoArquivoModel tipoArquivo = tipoArquivoRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Tipo de arquivo não encontrado."));
//        return toDTO(tipoArquivo);
//    }
//
//    public List<TipoArquivoResponse> findByNomeTipoArquivo(String nomeTipoArquivo){
//        return tipoArquivoRepository.findByNomeTipoArquivo(nomeTipoArquivo)
//                .stream()
//                .map(this::toDTO)
//                .collect(Collectors.toList());
//    }
//}
