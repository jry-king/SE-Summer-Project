package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.MapEntity;
import com.zzbslayer.getsbackend.Service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value="/api")
public class MapController {
    @Autowired
    MapService mapService;

    @GetMapping(value="/map")
    @ResponseBody
    public String findByAreaid(@RequestParam("areaid")Integer areaid){
        return mapService.findByAreaid(areaid).getMap();
    }

    @PostMapping(value="/map/save")
    @ResponseBody
    public MapEntity save(@RequestBody MapEntity mapEntity){
        return mapService.save(mapEntity);
    }
}
