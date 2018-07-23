package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import com.zzbslayer.getsbackend.Service.MapService;
import org.hibernate.hql.internal.ast.tree.MapEntryNode;
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

    @GetMapping(value="/map")
    @ResponseBody
    public MapEntity findByAreaid(@RequestParam("areaid")Integer areaid){
        return mapService.findByAreaid(areaid);
    }

    @GetMapping(value="/map/all")
    @ResponseBody
    public List<MapEntity> findAll(){
        return mapService.findAll();
    }

    @PostMapping(value="/map/save")
    @ResponseBody
    public MapEntity save(@RequestBody MapEntity mapEntity){
        return mapService.save(mapEntity);
    }

    @DeleteMapping(value="/map/delete")
    @Transactional
    @ResponseBody
    public void deleteByMapid(@RequestParam("mapid")Integer mapid) {
        mapService.deleteByMapid(mapid);
    }

}
