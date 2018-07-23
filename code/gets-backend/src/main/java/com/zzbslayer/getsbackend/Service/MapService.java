package com.zzbslayer.getsbackend.Service;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;

import java.util.List;

public interface MapService {
    MapEntity findByAreaid(Integer areaid);

    MapEntity save(MapEntity mapEntity);

    void deleteByAreaid(Integer areaid);

    void deleteByMapid(Integer mapid);

    List<MapEntity> findAll();
}
