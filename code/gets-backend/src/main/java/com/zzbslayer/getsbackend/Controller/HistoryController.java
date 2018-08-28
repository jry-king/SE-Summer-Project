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

    @GetMapping("/history/areaid/{areaid}")
    @ResponseBody
    public List<HistoryEntity> getHistoryByAreaid(@PathVariable Integer areaid){
        return historyService.findByAreaid(areaid);
    }

    @GetMapping("/history/all")
    @ResponseBody
    public List<HistoryEntity> getAllHistory(){
        return historyService.findAll();
    }

    @PostMapping(value = "/history",consumes = "Application/json")
    @ResponseBody
    public HistoryEntity saveHistory(@RequestBody HistoryEntity historyEntity){
        return historyService.save(historyEntity);
    }

    @DeleteMapping(value = "/history/historyid/{historyid}")
    @Transactional
    @ResponseBody
    public void deleteHistoryByCameraid(@PathVariable Integer historyid){
        historyService.deleteByHistoryid(historyid);
    }
}
