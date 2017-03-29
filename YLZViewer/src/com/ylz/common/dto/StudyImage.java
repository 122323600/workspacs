package com.ylz.common.dto;

import java.math.BigDecimal;

public class StudyImage {
	private String localPath;
	private String imageUid;//图像唯一号
	private String imageNumber;//图像号
	private String fileName;//文件名
	private String seriesNumber;//序列号
	private BigDecimal keyFlag;//关键标记
	private String studyNo;//检查序号
	private String seriesUid;//序列唯一号
	private String modality;//设备类型
	private String sopClassUid;//图像类唯一号
	private String refImageUid;//参考图像唯一号	
	private String storePath;//
	private String filePath;
	private String studyUid;
	private String patLocalId;
	private String patientName; 
	private String patientSex;
	private String studyDate;
	private String seriesCount;
	private String fileFormat; 
	private int fileSize;
	private int windowCenter;
	private int windowWidth;
	public StudyImage(){
		
	}
	public String getLocalPath() {
		return localPath;
	}
	public void setLocalPath(String localPath) {
		this.localPath = localPath;
	}
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
	public String getSeriesNumber() {
		return seriesNumber;
	}
	public void setSeriesNumber(String seriesNumber) {
		this.seriesNumber = seriesNumber;
	}
	public BigDecimal getKeyFlag() {
		return keyFlag;
	}
	public void setKeyFlag(BigDecimal keyFlag) {
		this.keyFlag = keyFlag;
	}
	public String getStudyNo() {
		return studyNo;
	}
	public void setStudyNo(String studyNo) {
		this.studyNo = studyNo;
	}
	public String getSeriesUid() {
		return seriesUid;
	}
	public void setSeriesUid(String seriesUid) {
		this.seriesUid = seriesUid;
	}
	public String getModality() {
		return modality;
	}
	public void setModality(String modality) {
		this.modality = modality;
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

	public String getStorePath() {
		return storePath;
	}

	public void setStorePath(String storePath) {
		this.storePath = storePath;
	}

	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getStudyUid() {
		return studyUid;
	}

	public void setStudyUid(String studyUid) {
		this.studyUid = studyUid;
	}

	public String getPatLocalId() {
		return patLocalId;
	}

	public void setPatLocalId(String patLocalId) {
		this.patLocalId = patLocalId;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getPatientSex() {
		return patientSex;
	}

	public void setPatientSex(String patientSex) {
		this.patientSex = patientSex;
	}

	public String getStudyDate() {
		return studyDate;
	}

	public void setStudyDate(String studyDate) {
		this.studyDate = studyDate;
	}

	public String getSeriesCount() {
		return seriesCount;
	}

	public void setSeriesCount(String seriesCount) {
		this.seriesCount = seriesCount;
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

	@Override
	public String toString() {
		return "StudyImage [fileName=" + fileName + ", imageNumber="
				+ imageNumber + ", imageUid=" + imageUid + ", keyFlag="
				+ keyFlag + ", modality=" + modality + ", refImageUid="
				+ refImageUid + ", seriesNumber=" + seriesNumber
				+ ", seriesUid=" + seriesUid + ", sopClassUid=" + sopClassUid
				+ ", studyNo=" + studyNo + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((studyNo == null) ? 0 : studyNo.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		StudyImage other = (StudyImage) obj;
		if (studyNo == null) {
			if (other.studyNo != null)
				return false;
		} else if (!studyNo.equals(other.studyNo))
			return false;
		return true;
	}
	
}
