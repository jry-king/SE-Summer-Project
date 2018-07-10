package com.zzbslayer.getsbackend.Service;

import com.zzbslayer.getsbackend.DataModel.Entity.CamerasEntity;

import java.util.List;

public interface CameraService {
    List<CamerasEntity> findByAreaid(Integer id);
    List<CamerasEntity> findAll();
}
