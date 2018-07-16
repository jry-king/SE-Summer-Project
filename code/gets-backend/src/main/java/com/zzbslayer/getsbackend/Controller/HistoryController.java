package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.HistoryEntity;
import com.zzbslayer.getsbackend.Service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value="/api")
public class HistoryController {
    @Autowired
    private HistoryService historyService;

    @GetMapping("/history")
    @ResponseBody
    public List<HistoryEntity> findByAreaid(@RequestParam("arecaid")Integer areaid){
        return historyService.findByAreaid(areaid);
    }

    @GetMapping("/history/all")
    @ResponseBody
    public List<HistoryEntity> findAll(){
        return historyService.findAll();
    }

    @PostMapping(value = "/history/save",consumes = "Application/json")
    @ResponseBody
    public HistoryEntity save(@RequestBody HistoryEntity historyEntity){
        return historyService.save(historyEntity);
    }

    @DeleteMapping(value = "/history/delete")
    @Transactional
    @ResponseBody
    public void deleteByCameraid(@RequestParam("historyid")Integer historyid){
        historyService.deleteByHistoryid(historyid);
    }
}
