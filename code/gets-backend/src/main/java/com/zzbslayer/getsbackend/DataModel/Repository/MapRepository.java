package com.zzbslayer.getsbackend.DataModel.Repository;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapRepository extends JpaRepository<MapEntity, Integer> {
    MapEntity findByAreaid(Integer areaid);
    void deleteByAreaid(Integer areaid);
}
