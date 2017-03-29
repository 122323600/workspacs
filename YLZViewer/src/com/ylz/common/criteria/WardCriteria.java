package com.ylz.common.criteria;

/**
 * 
 * @ClassName: WardCriteria.java 
 * @Description: 病区查询的查询条件
 * @Copyright: Copyright (c) 2016 
 * @company 易联众远程医疗事业部 
 * @author 罗航
 * @date 2016年11月2日 下午4:35:39 
 * @version V1.0
 */
public class WardCriteria {
	
	private String wardId;
	private String wardCode;
	private String wardName;
	private String wardAlias;
	private String orgId;
	private String orgName;
	private String deptId;
	private String deptName;
	private String wardIds;
	private String deptIds;
	
	public String getWardId() {
		return wardId;
	}
	public void setWardId(String wardId) {
		this.wardId = wardId;
	}
	public String getWardCode() {
		return wardCode;
	}
	public void setWardCode(String wardCode) {
		this.wardCode = wardCode;
	}
	public String getWardName() {
		return wardName;
	}
	public void setWardName(String wardName) {
		this.wardName = wardName;
	}
	public String getWardAlias() {
		return wardAlias;
	}
	public void setWardAlias(String wardAlias) {
		this.wardAlias = wardAlias;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getWardIds() {
		return wardIds;
	}
	public void setWardIds(String wardIds) {
		this.wardIds = wardIds;
	}
	public String getDeptIds() {
		return deptIds;
	}
	public void setDeptIds(String deptIds) {
		this.deptIds = deptIds;
	}
	
}
