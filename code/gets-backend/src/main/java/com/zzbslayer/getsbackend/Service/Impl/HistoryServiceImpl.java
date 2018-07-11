package com.zzbslayer.getsbackend.Service.Impl;

import com.zzbslayer.getsbackend.DataModel.Entity.HistoryEntity;
import com.zzbslayer.getsbackend.DataModel.Repository.HistoryRepository;
import com.zzbslayer.getsbackend.Service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryServiceImpl implements HistoryService{
    @Autowired
    private HistoryRepository historyRepository;

    public List<HistoryEntity> findAll(){
        return historyRepository.findAll();
    }

    public List<HistoryEntity> findByCameraid(Integer cameraid){
        return historyRepository.findByCameraid(cameraid);
    }

    public void deleteById(Integer id){
        historyRepository.deleteById(id);
    }

    public HistoryEntity save(HistoryEntity historyEntity) {
        return historyRepository.save(historyEntity);
    }
}
