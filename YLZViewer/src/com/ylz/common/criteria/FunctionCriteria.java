package com.ylz.common.criteria;

public class FunctionCriteria {

	
	private String funName;//查询时改字段为模糊查询
	private String funId;
	private String moduleId;
	private String sysId;
	private String funType;
	private String funCode;
	private String pfunId;
	private String useFlag;
	private String sortNo;
	private String menuUrl;
	private String fullName;//查询funName唯一性给此字段赋值
	private String funDesc;
	
	
	public String getFunDesc() {
		return funDesc;
	}
	public void setFunDesc(String funDesc) {
		this.funDesc = funDesc;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getFunType() {
		return funType;
	}
	public void setFunType(String funType) {
		this.funType = funType;
	}
	public String getFunCode() {
		return funCode;
	}
	public void setFunCode(String funCode) {
		this.funCode = funCode;
	}
	public String getPfunId() {
		return pfunId;
	}
	public void setPfunId(String pfunId) {
		this.pfunId = pfunId;
	}
	public String getUseFlag() {
		return useFlag;
	}
	public void setUseFlag(String useFlag) {
		this.useFlag = useFlag;
	}
	public String getSortNo() {
		return sortNo;
	}
	public void setSortNo(String sortNo) {
		this.sortNo = sortNo;
	}
	public String getMenuUrl() {
		return menuUrl;
	}
	public void setMenuUrl(String menuUrl) {
		this.menuUrl = menuUrl;
	}
	public String getFunName() {
		return funName;
	}
	public void setFunName(String funName) {
		this.funName = funName;
	}
	public String getFunId() {
		return funId;
	}
	public void setFunId(String funId) {
		this.funId = funId;
	}
	public String getModuleId() {
		return moduleId;
	}
	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}
	public String getSysId() {
		return sysId;
	}
	public void setSysId(String sysId) {
		this.sysId = sysId;
	}
}
