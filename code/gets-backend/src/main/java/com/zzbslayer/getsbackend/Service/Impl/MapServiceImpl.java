package com.zzbslayer.getsbackend.Service.Impl;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import com.zzbslayer.getsbackend.DataModel.Repository.MapRepository;
import com.zzbslayer.getsbackend.Service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MapServiceImpl implements MapService{
    @Autowired
    MapRepository mapRepository;

    public MapEntity findByAreaid(Integer areaid) {
        return mapRepository.findByAreaid(areaid);
    }

    public MapEntity save(MapEntity mapEntity) {
        return mapRepository.save(mapEntity);
    }

    @Override
    public void deleteByAreaid(Integer areaid) {
        mapRepository.deleteByAreaid(areaid);
    }
}
