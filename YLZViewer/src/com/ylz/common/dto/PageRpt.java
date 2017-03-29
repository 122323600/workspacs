package com.ylz.common.dto;

public class PageRpt {
	
	private String examNo;	//检查流水号
	private String reportNo;	//报告序号
	
	private String patLocalId; //检查号
	private String sickId; //病人号
	private String icCard; //社保卡号
	private String name; //姓名
	private String sex; //性别
	private String age; //年龄
	private String examDate; //检查日期
	private String reqDept; //申请科室
	private String bedNo; //床号
	private String inpatientNo; //住院号
	private String outpatientNo; //门诊号
	private String examOrgans; //检查部位
	private String examItems; //检查项目
	private String description; //检查(影像)所见
	private String impression; //印象
	private String reporter; //报告医生
	private String affirmReporter; //审核医生
	private String reportDate; //报告日期
	private String hospitalName; //医院名称（主标题）
	private String examClass; //检查类别（副标题）
	
	public PageRpt(){
		
	}
	
	public String getExamNo() {
		return examNo;
	}
	public void setExamNo(String examNo) {
		this.examNo = examNo;
	}
	public String getPatLocalId() {
		return patLocalId;
	}
	public void setPatLocalId(String patLocalId) {
		this.patLocalId = patLocalId;
	}
	public String getSickId() {
		return sickId;
	}
	public void setSickId(String sickId) {
		this.sickId = sickId;
	}
	public String getIcCard() {
		return icCard;
	}
	public void setIcCard(String icCard) {
		this.icCard = icCard;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getExamDate() {
		return examDate;
	}
	public void setExamDate(String examDate) {
		this.examDate = examDate;
	}
	public String getReqDept() {
		return reqDept;
	}
	public void setReqDept(String reqDept) {
		this.reqDept = reqDept;
	}
	public String getBedNo() {
		return bedNo;
	}
	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
	}
	public String getInpatientNo() {
		return inpatientNo;
	}
	public void setInpatientNo(String inpatientNo) {
		this.inpatientNo = inpatientNo;
	}
	public String getOutpatientNo() {
		return outpatientNo;
	}
	public void setOutpatientNo(String outpatientNo) {
		this.outpatientNo = outpatientNo;
	}
	public String getExamOrgans() {
		return examOrgans;
	}
	public void setExamOrgans(String examOrgans) {
		this.examOrgans = examOrgans;
	}
	public String getExamItems() {
		return examItems;
	}
	public void setExamItems(String examItems) {
		this.examItems = examItems;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getImpression() {
		return impression;
	}
	public void setImpression(String impression) {
		this.impression = impression;
	}
	public String getReporter() {
		return reporter;
	}
	public void setReporter(String reporter) {
		this.reporter = reporter;
	}
	public String getAffirmReporter() {
		return affirmReporter;
	}
	public void setAffirmReporter(String affirmReporter) {
		this.affirmReporter = affirmReporter;
	}
	public String getReportDate() {
		return reportDate;
	}
	public void setReportDate(String reportDate) {
		this.reportDate = reportDate;
	}
	public String getHospitalName() {
		return hospitalName;
	}
	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}
	public String getExamClass() {
		return examClass;
	}
	public void setExamClass(String examClass) {
		this.examClass = examClass;
	}

	public String getReportNo() {
		return reportNo;
	}

	public void setReportNo(String reportNo) {
		this.reportNo = reportNo;
	}

}
