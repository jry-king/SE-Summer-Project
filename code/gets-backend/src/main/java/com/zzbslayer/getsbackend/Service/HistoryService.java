package com.zzbslayer.getsbackend.Service;

import com.zzbslayer.getsbackend.DataModel.Entity.HistoryEntity;

import java.util.List;

public interface HistoryService {
    List<HistoryEntity> findAll();

    List<HistoryEntity> findByCameraid(Integer cameraid);

    void deleteByCameraid(Integer caemraid);
}
