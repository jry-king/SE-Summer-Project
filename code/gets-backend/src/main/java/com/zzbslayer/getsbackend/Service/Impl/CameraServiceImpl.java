package com.zzbslayer.getsbackend.Service.Impl;

import com.zzbslayer.getsbackend.DataModel.Entity.CamerasEntity;
import com.zzbslayer.getsbackend.DataModel.Repository.CameraRepository;
import com.zzbslayer.getsbackend.Service.CameraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CameraServiceImpl implements CameraService{
    @Autowired
    private CameraRepository cameraRepository;

    public List<CamerasEntity> findByAreaid(Integer id) {
        return cameraRepository.findByAreaid(id);
    }

    public List<CamerasEntity> findAll(){
        return cameraRepository.findAll();
    }

    public void deleteByCameraid(Integer cameraid){
        cameraRepository.deleteByCameraid(cameraid);
    }

    public CamerasEntity save(CamerasEntity camerasEntity){
        return cameraRepository.save(camerasEntity);
    }
}
