package com.zzbslayer.getsbackend.DataModel.Repository;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MapRepository extends JpaRepository<MapEntity, Integer> {
    MapEntity findByAreaid(Integer areaid);
    MapEntity findByMapid(Integer mapid);

    void deleteByAreaid(Integer areaid);
    void deleteByMapid(Integer mapid);
    List<MapEntity> findAll();

}
