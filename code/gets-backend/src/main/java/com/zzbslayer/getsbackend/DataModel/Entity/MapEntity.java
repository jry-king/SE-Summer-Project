package com.zzbslayer.getsbackend.DataModel.Entity;

import javax.persistence.*;

@Entity
@Table(name = "map", schema = "gets", catalog = "")
public class MapEntity {
    private int areaid;
    private String map;

    @Id
    @Column(name = "areaid", nullable = false)
    public int getAreaid() {
        return areaid;
    }

    public void setAreaid(int areaid) {
        this.areaid = areaid;
    }

    @Basic
    @Column(name = "map", nullable = true, length = 50000)
    public String getMap() {
        return map;
    }

    public void setMap(String map) {
        this.map = map;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MapEntity mapEntity = (MapEntity) o;

        if (areaid != mapEntity.areaid) return false;
        if (map != null ? !map.equals(mapEntity.map) : mapEntity.map != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = areaid;
        result = 31 * result + (map != null ? map.hashCode() : 0);
        return result;
    }
}
