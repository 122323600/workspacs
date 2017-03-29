package com.ylz.common.dto;

import java.util.List;

public class Study {
	private String studyNo; 			//
	private String studyUid; 			//
	private String studyDate; 			//
	private String studyTime; 			//
	private String studyId; 			//
	
	private int keyImageCount;
	private String patLocalId; 			//
	private String aetitle; 			//
	private String modality; 			//
	private int seriesCount; 			//
	
	private String patientName; 		//
	private String patientSex;	
	private String patientAge; 			//
	
	private String storePath;
	private String localPath;
	
	private List<Serie> series;

	public String getStudyNo() {
		return studyNo;
	}

	public void setStudyNo(String studyNo) {
		this.studyNo = studyNo;
	}

	public String getStudyUid() {
		return studyUid;
	}

	public void setStudyUid(String studyUid) {
		this.studyUid = studyUid;
	}

	public String getStudyDate() {
		return studyDate;
	}

	public void setStudyDate(String studyDate) {
		this.studyDate = studyDate;
	}

	public String getStudyTime() {
		return studyTime;
	}

	public void setStudyTime(String studyTime) {
		this.studyTime = studyTime;
	}

	public String getStudyId() {
		return studyId;
	}

	public void setStudyId(String studyId) {
		this.studyId = studyId;
	}

	public String getPatLocalId() {
		return patLocalId;
	}

	public void setPatLocalId(String patLocalId) {
		this.patLocalId = patLocalId;
	}

	public String getAetitle() {
		return aetitle;
	}

	public void setAetitle(String aetitle) {
		this.aetitle = aetitle;
	}

	public String getModality() {
		return modality;
	}

	public void setModality(String modality) {
		this.modality = modality;
	}

	public int getSeriesCount() {
		return seriesCount;
	}

	public void setSeriesCount(int seriesCount) {
		this.seriesCount = seriesCount;
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

	public String getPatientAge() {
		return patientAge;
	}

	public void setPatientAge(String patientAge) {
		this.patientAge = patientAge;
	}

	public String getStorePath() {
		return storePath;
	}

	public void setStorePath(String storePath) {
		this.storePath = storePath;
	}

	public String getLocalPath() {
		return localPath;
	}

	public void setLocalPath(String localPath) {
		this.localPath = localPath;
	}

	public List<Serie> getSeries() {
		return series;
	}

	public void setSeries(List<Serie> series) {
		this.series = series;
	}

	public int getKeyImageCount() {
		return keyImageCount;
	}

	public void setKeyImageCount(int keyImageCount) {
		this.keyImageCount = keyImageCount;
	}
}
