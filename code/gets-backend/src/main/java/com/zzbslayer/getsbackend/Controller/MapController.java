package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import com.zzbslayer.getsbackend.Service.MapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value="/api")
public class MapController {
    @Autowired
    MapService mapService;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @GetMapping(value="/map/areaid/{areaid}")
    @ResponseBody
    public MapEntity getMapByAreaid(@PathVariable Integer areaid){
        logger.info("SQL-RECORD: select * from map where areaid = " + areaid);
        return mapService.findByAreaid(areaid);
    }

    @GetMapping(value="/map/all")
    @ResponseBody
    public List<MapEntity> getAllMap(){
        logger.info("SQL-RECORD: select * from map");
        return mapService.findAll();
    }

    @PostMapping(value="/map")
    @ResponseBody
    public MapEntity saveMap(@RequestBody MapEntity mapEntity){
        logger.info("SQL-RECORD: insert into cameras values("
                + mapEntity.getMapid() + ","
                + mapEntity.getAreaid() + ","
                + mapEntity.getMap() + " )");
        return mapService.save(mapEntity);
    }

    @DeleteMapping(value="/map/mapid/{mapid}")
    @Transactional
    @ResponseBody
    public void deleteMapByMapid(@PathVariable Integer mapid) {
        logger.info("SQL-RECORD: delete from map where mapid = " + mapid);
        mapService.deleteByMapid(mapid);
    }

}
