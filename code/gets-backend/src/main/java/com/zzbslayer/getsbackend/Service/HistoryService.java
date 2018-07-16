package com.zzbslayer.getsbackend.Service;

import com.zzbslayer.getsbackend.DataModel.Entity.HistoryEntity;

import java.util.List;

public interface HistoryService {
    List<HistoryEntity> findAll();

    List<HistoryEntity> findByAreaid(Integer areaid);

    void deleteByHistoryid(Integer id);

    HistoryEntity save(HistoryEntity historyEntity);
}
