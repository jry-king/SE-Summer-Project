package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.CamerasEntity;
import com.zzbslayer.getsbackend.Service.CameraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/api")
public class CameraController {
    @Autowired
    private CameraService cameraService;

    @GetMapping(value = "/camera/all")
    @ResponseBody
    public List<CamerasEntity> getAllCamera(){
        return cameraService.findAll();
    }

    @GetMapping(value = "/camera/areaid/{areaid}")
    @ResponseBody
    public List<CamerasEntity> getCameraByAreaid(@PathVariable Integer areaid){
        return cameraService.findByAreaid(areaid);
    }

    @PostMapping(value = "/camera",consumes = "Application/json")
    @ResponseBody
    public CamerasEntity saveCamera(@RequestBody CamerasEntity camerasEntity){
        return cameraService.save(camerasEntity);
    }

    @DeleteMapping(value = "/camera/cameraid/{cameraid}")
    @Transactional
    @ResponseBody
    public void deleteCameraByCameraid(@PathVariable Integer cameraid){
        cameraService.deleteByCameraid(cameraid);
    }
}
