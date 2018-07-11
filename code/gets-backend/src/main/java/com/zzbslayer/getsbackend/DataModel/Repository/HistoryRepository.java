package com.zzbslayer.getsbackend.DataModel.Repository;

import com.zzbslayer.getsbackend.DataModel.Entity.HistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<HistoryEntity, Integer> {
    List<HistoryEntity> findAll();

    List<HistoryEntity> findByCameraid(Integer cameraid);

    void deleteById(Integer id);
}
