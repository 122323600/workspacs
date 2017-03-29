package com.ylz.common.dto;

import java.util.List;

public class PageImageInfo {

	private String studyNo;
	
	private String userId;
	private String password;
	private String passwordEncrypt;
	private String shareName;
	private String clinicTransType;
	private String ipAddr;
	private String imageCount;
	private String name;
	private String storePath;
	private String examNo;
	private String reportUrl;
	private boolean success;
	private String errMsg;
	private boolean hiddenPrivateImage=false;
	private int privateImageCount=0;
	//新增配置项参数,由用户在config.xml中配置
	private int configValue;
	private String studySeries;
	private String ftpPort;
	
	private List<String> seriesFileName;
	
	public List<String> getSeriesFileName() {
		return seriesFileName;
	}
	public void setSeriesFileName(List<String> seriesFileName) {
		this.seriesFileName = seriesFileName;
	}
	public int getConfigValue() {
		return configValue;
	}
	public void setConfigValue(int configValue) {
		this.configValue = configValue;
	}
	public String getStudyNo() {
		return studyNo;
	}
	public void setStudyNo(String studyNo) {
		this.studyNo = studyNo;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getShareName() {
		return shareName;
	}
	public void setShareName(String shareName) {
		this.shareName = shareName;
	}
	public String getClinicTransType() {
		return clinicTransType;
	}
	public void setClinicTransType(String clinicTransType) {
		this.clinicTransType = clinicTransType;
	}
	public String getIpAddr() {
		return ipAddr;
	}
	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}
	public String getImageCount() {
		return imageCount;
	}
	public void setImageCount(String imageCount) {
		this.imageCount = imageCount;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getStorePath() {
		return storePath;
	}
	public void setStorePath(String storePath) {
		this.storePath = storePath;
	}
	public String getExamNo() {
		return examNo;
	}
	public void setExamNo(String examNo) {
		this.examNo = examNo;
	}
	public String getReportUrl() {
		return reportUrl;
	}
	public void setReportUrl(String reportUrl) {
		this.reportUrl = reportUrl;
	}
	public String getPasswordEncrypt() {
		return passwordEncrypt;
	}
	public void setPasswordEncrypt(String passwordEncrypt) {
		this.passwordEncrypt = passwordEncrypt;
	}
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getErrMsg() {
		return errMsg;
	}
	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}
	public boolean isHiddenPrivateImage() {
		return hiddenPrivateImage;
	}
	public void setHiddenPrivateImage(boolean hiddenPrivateImage) {
		this.hiddenPrivateImage = hiddenPrivateImage;
	}
	public int getPrivateImageCount() {
		return privateImageCount;
	}
	public void setPrivateImageCount(int privateImageCount) {
		this.privateImageCount = privateImageCount;
	}
	public String getStudySeries() {
		return studySeries;
	}
	public void setStudySeries(String studySeries) {
		this.studySeries = studySeries;
	}
	public String getFtpPort() {
		return ftpPort;
	}
	public void setFtpPort(String ftpPort) {
		this.ftpPort = ftpPort;
	}
}
