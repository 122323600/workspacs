package com.ylz.common.dto;

public class DictDept {

	public DictDept(){}
	
	private String deptCode;
	
	private String deptName;
	
	private String deptAlias;
	
	private String clinicAttr;
	
	private String outpOrInp;//门诊住院科室标志
	
	private String inteOrSerg;
	
	private String inputCode;
	
	private String outerCode;
	
	private String hospitalCode;
	
	private String shareGroup;
	
	private int sortNo;

	public String getDeptCode() {
		return deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getDeptAlias() {
		return deptAlias;
	}

	public void setDeptAlias(String deptAlias) {
		this.deptAlias = deptAlias;
	}

	public String getClinicAttr() {
		return clinicAttr;
	}

	public void setClinicAttr(String clinicAttr) {
		this.clinicAttr = clinicAttr;
	}

	public String getOutpOrInp() {
		return outpOrInp;
	}

	public void setOutpOrInp(String outpOrInp) {
		this.outpOrInp = outpOrInp;
	}

	public String getInteOrSerg() {
		return inteOrSerg;
	}

	public void setInteOrSerg(String inteOrSerg) {
		this.inteOrSerg = inteOrSerg;
	}

	public String getInputCode() {
		return inputCode;
	}

	public void setInputCode(String inputCode) {
		this.inputCode = inputCode;
	}

	public String getOuterCode() {
		return outerCode;
	}

	public void setOuterCode(String outerCode) {
		this.outerCode = outerCode;
	}

	public String getHospitalCode() {
		return hospitalCode;
	}

	public void setHospitalCode(String hospitalCode) {
		this.hospitalCode = hospitalCode;
	}

	public String getShareGroup() {
		return shareGroup;
	}

	public void setShareGroup(String shareGroup) {
		this.shareGroup = shareGroup;
	}

	public int getSortNo() {
		return sortNo;
	}

	public void setSortNo(int sortNo) {
		this.sortNo = sortNo;
	}
}
