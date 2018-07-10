package com.zzbslayer.getsbackend.DataModel.Entity;

import javax.persistence.*;

@Entity
@Table(name = "history", schema = "gets", catalog = "")
public class HistoryEntity {
    private int id;
    private int cameraid;
    private String filename;

    @Id
    @Column(name = "id", nullable = false)
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "cameraid", nullable = false)
    public int getCameraid() {
        return cameraid;
    }

    public void setCameraid(int cameraid) {
        this.cameraid = cameraid;
    }

    @Basic
    @Column(name = "filename", nullable = false, length = 100)
    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        HistoryEntity that = (HistoryEntity) o;

        if (id != that.id) return false;
        if (cameraid != that.cameraid) return false;
        if (filename != null ? !filename.equals(that.filename) : that.filename != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + cameraid;
        result = 31 * result + (filename != null ? filename.hashCode() : 0);
        return result;
    }
}
