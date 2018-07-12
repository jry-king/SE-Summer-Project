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
    public List<CamerasEntity> findAll(){
        return cameraService.findAll();
    }

    @GetMapping(value = "/camera")
    @ResponseBody
    public List<CamerasEntity> findByAreaid(@RequestParam("areaid")Integer areaid){
        return cameraService.findByAreaid(areaid);
    }

    @PostMapping(value = "/camera/save",consumes = "Application/json")
    @ResponseBody
    public CamerasEntity save(@RequestBody CamerasEntity camerasEntity){
        return cameraService.save(camerasEntity);
    }

    @DeleteMapping(value = "/camera/delete")
    @Transactional
    @ResponseBody
    public void deleteByCameraid(@RequestParam("cameraid")Integer cameraid){
        cameraService.deleteByCameraid(cameraid);
    }
}
