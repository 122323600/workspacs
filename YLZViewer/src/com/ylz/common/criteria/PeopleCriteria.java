package com.ylz.common.criteria;

/**
 * 
 * @ClassName: PeopleCriteria.java 
 * @Description: 人员用户查询的查询条件
 * @Copyright: Copyright (c) 2016 
 * @company 易联众远程医疗事业部 
 * @author 周昭名
 * @date 2016年11月2日 下午4:35:39 
 * @version V1.0
 */
public class PeopleCriteria {

	
	private String workNo;
	private String name;
	private String alias;
	private String orgId;
	private String deptId;
	private String peopleType;
	private String jobLevel;
	private String phoneNumber;
	private String inputCode;
	private String email;
	private String certificateType;
	private String identityNo;
	private String cardNo;
	private String wechatNo;
	private String qqNo;
	private String alipayNo;
	private String bankName;
	private String bankAccount;
	
	
	private String loginName;
	private String userType;
	private String publicFlag;
	private String certFlag;
	private String userFlag;
	
	private String sectionId;
	
	//临时字段 标识人员在列表中是否显示（人员是否失效）
	private String peopleFlag;//
	
	
	public String getWorkNo() {
		return workNo;
	}
	public void setWorkNo(String workNo) {
		this.workNo = workNo;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getPeopleType() {
		return peopleType;
	}
	public void setPeopleType(String peopleType) {
		this.peopleType = peopleType;
	}
	public String getJobLevel() {
		return jobLevel;
	}
	public void setJobLevel(String jobLevel) {
		this.jobLevel = jobLevel;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getInputCode() {
		return inputCode;
	}
	public void setInputCode(String inputCode) {
		this.inputCode = inputCode;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getIdentityNo() {
		return identityNo;
	}
	public void setIdentityNo(String identityNo) {
		this.identityNo = identityNo;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getWechatNo() {
		return wechatNo;
	}
	public void setWechatNo(String wechatNo) {
		this.wechatNo = wechatNo;
	}
	public String getQqNo() {
		return qqNo;
	}
	public void setQqNo(String qqNo) {
		this.qqNo = qqNo;
	}
	public String getAlipayNo() {
		return alipayNo;
	}
	public void setAlipayNo(String alipayNo) {
		this.alipayNo = alipayNo;
	}
	public String getBankName() {
		return bankName;
	}
	public void setBankName(String bankName) {
		this.bankName = bankName;
	}
	public String getBankAccount() {
		return bankAccount;
	}
	public void setBankAccount(String bankAccount) {
		this.bankAccount = bankAccount;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	public String getPublicFlag() {
		return publicFlag;
	}
	public void setPublicFlag(String publicFlag) {
		this.publicFlag = publicFlag;
	}
	public String getCertFlag() {
		return certFlag;
	}
	public void setCertFlag(String certFlag) {
		this.certFlag = certFlag;
	}
	public String getUserFlag() {
		return userFlag;
	}
	public void setUserFlag(String userFlag) {
		this.userFlag = userFlag;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getCertificateType() {
		return certificateType;
	}
	public void setCertificateType(String certificateType) {
		this.certificateType = certificateType;
	}
	public String getSectionId() {
		return sectionId;
	}
	public void setSectionId(String sectionId) {
		this.sectionId = sectionId;
	}
	public String getPeopleFlag() {
		return peopleFlag;
	}
	public void setPeopleFlag(String peopleFlag) {
		this.peopleFlag = peopleFlag;
	}
	
	
}
