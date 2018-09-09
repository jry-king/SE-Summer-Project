package com.zzbslayer.getsbackend.Controller;

import com.zzbslayer.getsbackend.DataModel.Entity.HistoryEntity;
import com.zzbslayer.getsbackend.Service.HistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @GetMapping("/history/areaid/{areaid}")
    @ResponseBody
    public List<HistoryEntity> getHistoryByAreaid(@PathVariable Integer areaid){
        logger.info("SQL RECORD: select * from history where areaid = " + areaid);
        return historyService.findByAreaid(areaid);
    }

    @GetMapping("/history/all")
    @ResponseBody
    public List<HistoryEntity> getAllHistory(){
        logger.info("SQL-RECORD: select * from history");
        return historyService.findAll();
    }

    @PostMapping(value = "/history",consumes = "Application/json")
    @ResponseBody
    public HistoryEntity saveHistory(@RequestBody HistoryEntity historyEntity){
        logger.info("SQL-RECORD: insert into cameras values("
                + historyEntity.getHistoryid() + ","
                + historyEntity.getCameraid() + ","
                + historyEntity.getAreaid() + ","
                + historyEntity.getFilename() + " )");
        return historyService.save(historyEntity);
    }

    @DeleteMapping(value = "/history/historyid/{historyid}")
    @Transactional
    @ResponseBody
    public void deleteHistoryByCameraid(@PathVariable Integer historyid){
        logger.info("SQL-RECORD: delete from history where historyid = " + historyid);
        historyService.deleteByHistoryid(historyid);
    }
}
