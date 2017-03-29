package com.ylz.common.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 检查表
 * @author zqr
 */
public class Studys implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 默认构造函数
	 */
	public Studys() {
	}

	private String storePath; 			//
	private String studyUid; 			//
	private BigDecimal imageCount; 		//
	private String patLocalId; 			//
	private String aetitle; 			//
	private String modality; 			//
	private String svrNameOne; 			//
	private String svrNameTwo; 			//
	private BigDecimal svrOneOnline; 	//
	private BigDecimal svrTwoOnline; 	//
	private BigDecimal seriesCount; 	//
	private String studyInstance2; 		//
	private String studyDescription;	//
	private String studyId; 			//
	private String studyNo; 			//
	private String studyDate; 			//
	private String studyTime; 			//
	private String patientName; 		//
	private String patientSex;	
	private String patientAge; 			//
	private String deviceName; 			//
	private BigDecimal fileSizeOne; 	//
	private BigDecimal fileSizeTwo; 	//
	private String birthDate; 			//
	private String accessionNo; 		//
	private BigDecimal keyImageCount; 	//
	private String hospitalCode; 		//
	private String archiveDate; 		//
	private String archiveTime; 		//
	
	private String studySeries;
	private List<String> studySeriesUid;
	private boolean commonImage=false;		
	
	public boolean isCommonImage() {
		return commonImage;
	}
	public void setCommonImage(boolean commonImage) {
		this.commonImage = commonImage;
	}
	public List<String> getStudySeriesUid() {
		return studySeriesUid;
	}
	public void setStudySeriesUid(List<String> studySeriesUid) {
		this.studySeriesUid = studySeriesUid;
	}
	public String getStorePath() {
		return storePath;
	}
	public void setStorePath(String storePath) {
		this.storePath = storePath;
	}
	public String getStudyUid() {
		return studyUid;
	}
	public void setStudyUid(String studyUid) {
		this.studyUid = studyUid;
	}
	public BigDecimal getImageCount() {
		return imageCount;
	}
	public void setImageCount(BigDecimal imageCount) {
		this.imageCount = imageCount;
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
	public String getSvrNameOne() {
		return svrNameOne;
	}
	public void setSvrNameOne(String svrNameOne) {
		this.svrNameOne = svrNameOne;
	}
	public String getSvrNameTwo() {
		return svrNameTwo;
	}
	public void setSvrNameTwo(String svrNameTwo) {
		this.svrNameTwo = svrNameTwo;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public BigDecimal getSvrOneOnline() {
		return svrOneOnline;
	}
	public void setSvrOneOnline(BigDecimal svrOneOnline) {
		this.svrOneOnline = svrOneOnline;
	}
	public BigDecimal getSvrTwoOnline() {
		return svrTwoOnline;
	}
	public void setSvrTwoOnline(BigDecimal svrTwoOnline) {
		this.svrTwoOnline = svrTwoOnline;
	}
	public BigDecimal getSeriesCount() {
		return seriesCount;
	}
	public void setSeriesCount(BigDecimal seriesCount) {
		this.seriesCount = seriesCount;
	}
	public String getStudyInstance2() {
		return studyInstance2;
	}
	public void setStudyInstance2(String studyInstance2) {
		this.studyInstance2 = studyInstance2;
	}
	public String getStudyDescription() {
		return studyDescription;
	}
	public void setStudyDescription(String studyDescription) {
		this.studyDescription = studyDescription;
	}
	public String getStudyId() {
		return studyId;
	}
	public void setStudyId(String studyId) {
		this.studyId = studyId;
	}
	public String getStudyNo() {
		return studyNo;
	}
	public void setStudyNo(String studyNo) {
		this.studyNo = studyNo;
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
	public String getDeviceName() {
		return deviceName;
	}
	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}
	public BigDecimal getFileSizeOne() {
		return fileSizeOne;
	}
	public void setFileSizeOne(BigDecimal fileSizeOne) {
		this.fileSizeOne = fileSizeOne;
	}
	public BigDecimal getFileSizeTwo() {
		return fileSizeTwo;
	}
	public void setFileSizeTwo(BigDecimal fileSizeTwo) {
		this.fileSizeTwo = fileSizeTwo;
	}
	public String getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(String birthDate) {
		this.birthDate = birthDate;
	}
	public String getAccessionNo() {
		return accessionNo;
	}
	public void setAccessionNo(String accessionNo) {
		this.accessionNo = accessionNo;
	}
	public BigDecimal getKeyImageCount() {
		return keyImageCount;
	}
	public void setKeyImageCount(BigDecimal keyImageCount) {
		this.keyImageCount = keyImageCount;
	}
	public String getHospitalCode() {
		return hospitalCode;
	}
	public void setHospitalCode(String hospitalCode) {
		this.hospitalCode = hospitalCode;
	}
	public String getArchiveDate() {
		return archiveDate;
	}
	public void setArchiveDate(String archiveDate) {
		this.archiveDate = archiveDate;
	}
	public String getArchiveTime() {
		return archiveTime;
	}
	public void setArchiveTime(String archiveTime) {
		this.archiveTime = archiveTime;
	}	
	public String getStudySeries() {
		return studySeries;
	}
	public void setStudySeries(String studySeries) {
		this.studySeries = studySeries;
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
		Studys other = (Studys) obj;
		if (studyNo == null) {
			if (other.studyNo != null)
				return false;
		} else if (!studyNo.equals(other.studyNo))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "StudysDTO [accessionNo=" + accessionNo + ", aetitle=" + aetitle
				+ ", archiveDate=" + archiveDate + ", archiveTime="
				+ archiveTime + ", birthDate=" + birthDate + ", deviceName="
				+ deviceName + ", fileSizeOne=" + fileSizeOne
				+ ", fileSizeTwo=" + fileSizeTwo + ", hospitalCode="
				+ hospitalCode + ", imageCount=" + imageCount
				+ ", keyImageCount=" + keyImageCount + ", modality=" + modality
				+ ", patLocalId=" + patLocalId + ", patientAge=" + patientAge
				+ ", patientName=" + patientName + ", patientSex=" + patientSex
				+ ", seriesCount=" + seriesCount + ", storePath=" + storePath
				+ ", studyDate=" + studyDate + ", studyDescription="
				+ studyDescription + ", studyId=" + studyId
				+ ", studyInstance2=" + studyInstance2 + ", studyNo=" + studyNo
				+ ", studyTime=" + studyTime + ", studyUid=" + studyUid
				+ ", svrNameOne=" + svrNameOne + ", svrNameTwo=" + svrNameTwo
				+ ", svrOneOnline=" + svrOneOnline + ", svrTwoOnline="
				+ svrTwoOnline + "]";
	}

}
