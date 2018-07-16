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

    public List<HistoryEntity> findByAreaid(Integer areaid){
        return historyRepository.findByAreaid(areaid);
    }

    public void deleteByHistoryid(Integer id){
        historyRepository.deleteById(id);
    }

    public HistoryEntity save(HistoryEntity historyEntity) {
        if (historyEntity.getHistoryid()==0)
            return historyRepository.save(historyEntity);
        HistoryEntity historyEntity1 = historyRepository.findByHistoryid(historyEntity.getHistoryid());
        historyEntity1.setCameraid(historyEntity.getCameraid());
        historyEntity1.setFilename(historyEntity.getFilename());
        return historyRepository.save(historyEntity1);
    }
}
