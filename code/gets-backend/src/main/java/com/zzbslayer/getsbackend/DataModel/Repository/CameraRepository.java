package com.zzbslayer.getsbackend.DataModel.Repository;

import com.zzbslayer.getsbackend.DataModel.Entity.CamerasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CameraRepository extends JpaRepository<CamerasEntity, Integer>{

    List<CamerasEntity> findAll();

    List<CamerasEntity> findByAreaid(Integer areaid);

    void deleteByCameraid(Integer cameraid);

    CamerasEntity findByCameraid(Integer cameraid);
}
