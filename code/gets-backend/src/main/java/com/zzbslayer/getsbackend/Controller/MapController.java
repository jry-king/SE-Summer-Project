package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import com.zzbslayer.getsbackend.Service.MapService;
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

    @GetMapping(value="/map/areaid/{areaid}")
    @ResponseBody
    public MapEntity getMapByAreaid(@PathVariable Integer areaid){
        return mapService.findByAreaid(areaid);
    }

    @GetMapping(value="/map/all")
    @ResponseBody
    public List<MapEntity> getAllMap(){
        return mapService.findAll();
    }

    @PostMapping(value="/map")
    @ResponseBody
    public MapEntity saveMap(@RequestBody MapEntity mapEntity){
        return mapService.save(mapEntity);
    }

    @DeleteMapping(value="/map/mapid/{mapid}")
    @Transactional
    @ResponseBody
    public void deleteMapByMapid(@PathVariable Integer mapid) {
        mapService.deleteByMapid(mapid);
    }

}
