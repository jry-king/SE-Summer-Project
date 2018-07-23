package com.zzbslayer.getsbackend.DataModel.Entity;

import javax.persistence.*;

@Entity
@Table(name = "map", schema = "gets", catalog = "")
public class MapEntity {
    private int mapid;
    private String map;
    private int areaid;

    @Basic
    @Column(name = "mapid", nullable = false)
    public int getMapid() {
        return mapid;
    }

    public void setMapid(int mapid) {
        this.mapid = mapid;
    }

    @Basic
    @Column(name = "map", nullable = false, length = 500)
    public String getMap() {
        return map;
    }

    public void setMap(String map) {
        this.map = map;
    }

    @Id
    @Column(name = "areaid", nullable = false)
    public int getAreaid() {
        return areaid;
    }

    public void setAreaid(int areaid) {
        this.areaid = areaid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MapEntity mapEntity = (MapEntity) o;

        if (mapid != mapEntity.mapid) return false;
        if (areaid != mapEntity.areaid) return false;
        if (map != null ? !map.equals(mapEntity.map) : mapEntity.map != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = mapid;
        result = 31 * result + (map != null ? map.hashCode() : 0);
        result = 31 * result + areaid;
        return result;
    }
}
