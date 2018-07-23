package com.zzbslayer.getsbackend.Service.Impl;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import com.zzbslayer.getsbackend.DataModel.Repository.MapRepository;
import com.zzbslayer.getsbackend.Service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapServiceImpl implements MapService{
    @Autowired
    MapRepository mapRepository;

    public MapEntity findByAreaid(Integer areaid) {
        return mapRepository.findByAreaid(areaid);
    }

    public MapEntity save(MapEntity mapEntity) {
        if (mapEntity.getMapid()==0)
            return mapRepository.save(mapEntity);
        MapEntity mapEntity1 = mapRepository.findByMapid(mapEntity.getMapid());
        mapEntity1.setAreaid(mapEntity.getAreaid());
        mapEntity1.setMap(mapEntity.getMap());
        return mapRepository.save(mapEntity1);

    }

    public void deleteByMapid(Integer mapid) {
        mapRepository.deleteByMapid(mapid);
    }

    public List<MapEntity> findAll(){
        return mapRepository.findAll();
    }
}
