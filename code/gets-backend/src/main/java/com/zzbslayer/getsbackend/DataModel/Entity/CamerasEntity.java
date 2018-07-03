package com.zzbslayer.getsbackend.DataModel.Entity;

import javax.persistence.*;

@Entity
@Table(name = "cameras", schema = "gets", catalog = "")
public class CamerasEntity {
    private int cameraid;
    private String param1;
    private String param2;
    private String param3;
    private String x;
    private String y;
    private int areaid;

    @Id
    @Column(name = "cameraid", nullable = false)
    public int getCameraid() {
        return cameraid;
    }

    public void setCameraid(int cameraid) {
        this.cameraid = cameraid;
    }

    @Basic
    @Column(name = "param1", nullable = false, length = 40)
    public String getParam1() {
        return param1;
    }

    public void setParam1(String param1) {
        this.param1 = param1;
    }

    @Basic
    @Column(name = "param2", nullable = false, length = 40)
    public String getParam2() {
        return param2;
    }

    public void setParam2(String param2) {
        this.param2 = param2;
    }

    @Basic
    @Column(name = "param3", nullable = false, length = 40)
    public String getParam3() {
        return param3;
    }

    public void setParam3(String param3) {
        this.param3 = param3;
    }

    @Basic
    @Column(name = "x", nullable = false, length = 10)
    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    @Basic
    @Column(name = "y", nullable = false, length = 10)
    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    @Basic
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

        CamerasEntity that = (CamerasEntity) o;

        if (cameraid != that.cameraid) return false;
        if (areaid != that.areaid) return false;
        if (param1 != null ? !param1.equals(that.param1) : that.param1 != null) return false;
        if (param2 != null ? !param2.equals(that.param2) : that.param2 != null) return false;
        if (param3 != null ? !param3.equals(that.param3) : that.param3 != null) return false;
        if (x != null ? !x.equals(that.x) : that.x != null) return false;
        if (y != null ? !y.equals(that.y) : that.y != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = cameraid;
        result = 31 * result + (param1 != null ? param1.hashCode() : 0);
        result = 31 * result + (param2 != null ? param2.hashCode() : 0);
        result = 31 * result + (param3 != null ? param3.hashCode() : 0);
        result = 31 * result + (x != null ? x.hashCode() : 0);
        result = 31 * result + (y != null ? y.hashCode() : 0);
        result = 31 * result + areaid;
        return result;
    }
}
