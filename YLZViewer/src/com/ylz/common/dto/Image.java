package com.ylz.common.dto;

public class Image {
	private String imageUid;//图像唯一号
	private String imageNumber;//图像号
	private String fileName;//文件名
	private String filePath;
	private int keyFlag;//关键标记
	private String sopClassUid;//图像类唯一号
	private String refImageUid;//参考图像唯一号	
	private String fileFormat; 
	private int fileSize;
	private int windowCenter;
	private int windowWidth;
	public String getImageUid() {
		return imageUid;
	}
	public void setImageUid(String imageUid) {
		this.imageUid = imageUid;
	}
	public String getImageNumber() {
		return imageNumber;
	}
	public void setImageNumber(String imageNumber) {
		this.imageNumber = imageNumber;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public int getKeyFlag() {
		return keyFlag;
	}
	public void setKeyFlag(int keyFlag) {
		this.keyFlag = keyFlag;
	}
	public String getSopClassUid() {
		return sopClassUid;
	}
	public void setSopClassUid(String sopClassUid) {
		this.sopClassUid = sopClassUid;
	}
	public String getRefImageUid() {
		return refImageUid;
	}
	public void setRefImageUid(String refImageUid) {
		this.refImageUid = refImageUid;
	}
	public String getFileFormat() {
		return fileFormat;
	}
	public void setFileFormat(String fileFormat) {
		this.fileFormat = fileFormat;
	}
	public int getFileSize() {
		return fileSize;
	}
	public void setFileSize(int fileSize) {
		this.fileSize = fileSize;
	}
	public int getWindowCenter() {
		return windowCenter;
	}
	public void setWindowCenter(int windowCenter) {
		this.windowCenter = windowCenter;
	}
	public int getWindowWidth() {
		return windowWidth;
	}
	public void setWindowWidth(int windowWidth) {
		this.windowWidth = windowWidth;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
}
