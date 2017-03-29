package com.ylz.common.dto;

public class PageImage {
	
	private String filePath;
	
	private String region;
	private String columns;
	private String rows;
	private String annotation;
	private String imageQuality;
	private String windowCenter;
	private String windowWidth;
	
	private String id;
	private String title;
	private String modality;
	
	public PageImage(){
		
	}
	
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getRegion() {
		return region;
	}
	public void setRegion(String region) {
		this.region = region;
	}
	public String getColumns() {
		return columns;
	}
	public void setColumns(String columns) {
		this.columns = columns;
	}
	public String getRows() {
		return rows;
	}
	public void setRows(String rows) {
		this.rows = rows;
	}
	public String getAnnotation() {
		return annotation;
	}
	public void setAnnotation(String annotation) {
		this.annotation = annotation;
	}
	public String getImageQuality() {
		return imageQuality;
	}
	public void setImageQuality(String imageQuality) {
		this.imageQuality = imageQuality;
	}

	public String getWindowCenter() {
		return windowCenter;
	}

	public void setWindowCenter(String windowCenter) {
		this.windowCenter = windowCenter;
	}

	public String getWindowWidth() {
		return windowWidth;
	}

	public void setWindowWidth(String windowWidth) {
		this.windowWidth = windowWidth;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getModality() {
		return modality;
	}

	public void setModality(String modality) {
		this.modality = modality;
	}

}
