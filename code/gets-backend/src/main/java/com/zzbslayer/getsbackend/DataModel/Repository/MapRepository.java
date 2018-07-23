package com.zzbslayer.getsbackend.DataModel.Repository;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MapRepository extends JpaRepository<MapEntity, Integer> {
    MapEntity findByMapid(Integer mapid);
    MapEntity findByAreaid(Integer areaid);
    void deleteByMapid(Integer areaid);
    List<MapEntity> findAll();
}
