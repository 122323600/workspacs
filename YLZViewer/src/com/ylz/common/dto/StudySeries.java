package com.ylz.common.dto;

public class StudySeries {
    private String seriesUid;

    private String seriesNumber;

    private String modality;

    private Short imageCount;

    private String seriesDescription;

    private String studyNo;

    public String getSeriesUid() {
        return seriesUid;
    }

    public void setSeriesUid(String seriesUid) {
        this.seriesUid = seriesUid == null ? null : seriesUid.trim();
    }

    public String getSeriesNumber() {
        return seriesNumber;
    }

    public void setSeriesNumber(String seriesNumber) {
        this.seriesNumber = seriesNumber == null ? null : seriesNumber.trim();
    }

    public String getModality() {
        return modality;
    }

    public void setModality(String modality) {
        this.modality = modality == null ? null : modality.trim();
    }

    public Short getImageCount() {
        return imageCount;
    }

    public void setImageCount(Short imageCount) {
        this.imageCount = imageCount;
    }

    public String getSeriesDescription() {
        return seriesDescription;
    }

    public void setSeriesDescription(String seriesDescription) {
        this.seriesDescription = seriesDescription == null ? null : seriesDescription.trim();
    }

    public String getStudyNo() {
        return studyNo;
    }

    public void setStudyNo(String studyNo) {
        this.studyNo = studyNo == null ? null : studyNo.trim();
    }
}