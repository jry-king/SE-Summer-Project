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
        if (camerasEntity.getCameraid()==0)
            return cameraRepository.save(camerasEntity);
        CamerasEntity camerasEntity1 = cameraRepository.findByCameraid(camerasEntity.getCameraid());
        if (camerasEntity1 == null)
            return cameraRepository.save(camerasEntity);
        camerasEntity1.setAreaid(camerasEntity.getAreaid());
        camerasEntity1.setParam1(camerasEntity.getParam1());
        camerasEntity1.setParam2(camerasEntity.getParam2());
        camerasEntity1.setParam3(camerasEntity.getParam3());
        camerasEntity1.setX(camerasEntity.getX());
        camerasEntity1.setY(camerasEntity.getY());

        return cameraRepository.save(camerasEntity1);
    }
}
