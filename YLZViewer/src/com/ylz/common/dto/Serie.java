package com.ylz.common.dto;

import java.util.List;

public class Serie {
	private String seriesUid;
    private String seriesNumber;
    private Short imageCount;
    private String seriesDescription;
    private List<Image> images;
	public String getSeriesUid() {
		return seriesUid;
	}
	public void setSeriesUid(String seriesUid) {
		this.seriesUid = seriesUid;
	}
	public String getSeriesNumber() {
		return seriesNumber;
	}
	public void setSeriesNumber(String seriesNumber) {
		this.seriesNumber = seriesNumber;
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
		this.seriesDescription = seriesDescription;
	}
	public List<Image> getImages() {
		return images;
	}
	public void setImages(List<Image> images) {
		this.images = images;
	}
}
