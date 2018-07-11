package com.zzbslayer.getsbackend.Service;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;

public interface MapService {
    MapEntity findByAreaid(Integer areaid);

    MapEntity save(MapEntity mapEntity);

    void deleteByAreaid(Integer areaid);
}
