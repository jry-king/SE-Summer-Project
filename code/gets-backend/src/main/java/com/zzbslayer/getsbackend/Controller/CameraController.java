package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.CamerasEntity;
import com.zzbslayer.getsbackend.Service.CameraService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @GetMapping(value = "/camera/all")
    @ResponseBody
    public List<CamerasEntity> getAllCamera(){
        logger.info("SQL-RECORD: select * from cameras");
        return cameraService.findAll();
    }

    @GetMapping(value = "/camera/areaid/{areaid}")
    @ResponseBody
    public List<CamerasEntity> getCameraByAreaid(@PathVariable Integer areaid){
        logger.info("SQL-RECORD: select * from cameras where areaid = " + areaid);
        return cameraService.findByAreaid(areaid);
    }

    @PostMapping(value = "/camera",consumes = "Application/json")
    @ResponseBody
    public CamerasEntity saveCamera(@RequestBody CamerasEntity camerasEntity){
        logger.info("SQL-RECORD: insert into cameras values("
                + camerasEntity.getCameraid() + ","
                + camerasEntity.getParam1() + ","
                + camerasEntity.getParam2() + ","
                + camerasEntity.getParam3() + ","
                + camerasEntity.getX() + ","
                + camerasEntity.getY() + ","
                + camerasEntity.getAreaid() + " )");
        return cameraService.save(camerasEntity);
    }

    @DeleteMapping(value = "/camera/cameraid/{cameraid}")
    @Transactional
    @ResponseBody
    public void deleteCameraByCameraid(@PathVariable Integer cameraid){
        logger.info("SQL-RECORD: delete from cameras where cameraid = " + cameraid);
        cameraService.deleteByCameraid(cameraid);
    }
}
