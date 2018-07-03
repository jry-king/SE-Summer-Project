package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.CamerasEntity;
import com.zzbslayer.getsbackend.Service.CameraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping(value="/api")
public class CameraController {
    @Autowired
    private CameraService cameraService;

    @GetMapping(value="/camera")
    @ResponseBody
    public List<CamerasEntity> findByAreaid(@RequestParam("areaid")Integer areaid){
        return cameraService.findByAreaid(areaid);
    }
}
