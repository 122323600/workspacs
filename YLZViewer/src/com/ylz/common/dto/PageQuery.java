package com.ylz.common.dto;

import java.io.Serializable;
import java.util.List;

public class PageQuery implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private String startTime; //开始时间
	private String endTime; //结束时间
	private String startApm;//开始时段
	private String endApm;//结束时段
	private String device;//检查设备
	private String qcItem;//质控项目
	private String qcStandard;//质控标准
	private String disease;//疾病名称
	private String register;//登记人员
	private Boolean checkOnly;//只已检查并出报告
	private String reportNo; // 报告序号
	private String studyNo; // 检查序号
	private String name; // 姓名
	private String sex; // 性别
	private String age; // 年龄
	private String hospitalCode; //医院代码
	private String hospitalName; //医院名称
	private String examClass; // 检查类别
	private String examSubClass; // 检查子类别
	private String examItems; // 检查项目
	private String examOrgans;//检查部位
	private String examTime; // 检查时间
	private String scheduleTime; // 检查时间
	private String imageCount; // 图数
	private String icCard; // 社保卡号
	private String miCard; // 医保卡号
	private String identityCard;// 身份证号
	private String examNo; // 检查流水号
	private String patLocalId; //检查号
	private String sickId; //病人编号
	private String inpatientNo; //住院号
	private String outpatientNo; //门诊号
	private String deptCode;//科室代码(执行科室)
	private String deptName;//科室名称
	private String reqDept;//申请科室
	private String reqPhysician;//申请医生
	private int sampleAmount;//抽样数目
	private int sampleField;//抽样范围
	private String rownumList;//行号集合
	private String patientSource;//病人来源
	private String examStatus;//检查状态
	private String reportStatus;//报告状态
	private String reporter;//报告医生
	private String affirmReporter;//审核医生
	private String affirmDate;//审核日期
	private String affirmTime;//审核时间
	private String reportDate;//报告日期
	private String reportTime;//报告时间
	private String keyImageCount; //关键图数
	private String bedNo;//床号
	private String examMode;//检查方式
	private Integer examCount;//检查
	private Boolean isRelative;//是否相关(用于病人历史查询[临床浏览])
	
	private List<DictDept> reqDepts;//申请科室列表(用于医生同属多科室,共享分组查询)
	private int rows;	//分页-一页多少条
	private int page;	//分页-第几页
	private int total;  //查到多少条
	
	private boolean reportDelay;//报告是否需要延时
	
	private List<DictExamClass> examClassList;
	public PageQuery(){
		
	}

	
	public String getAffirmDate() {
		return affirmDate;
	}


	public void setAffirmDate(String affirmDate) {
		this.affirmDate = affirmDate;
	}


	public String getAffirmTime() {
		return affirmTime;
	}


	public void setAffirmTime(String affirmTime) {
		this.affirmTime = affirmTime;
	}


	public boolean isReportDelay() {
		return reportDelay;
	}


	public void setReportDelay(boolean reportDelay) {
		this.reportDelay = reportDelay;
	}


	public String getReportTime() {
		return reportTime;
	}


	public void setReportTime(String reportTime) {
		this.reportTime = reportTime;
	}


	public String getReportNo() {
		return reportNo;
	}

	public void setReportNo(String reportNo) {
		this.reportNo = reportNo;
	}

	public String getStudyNo() {
		return studyNo;
	}

	public void setStudyNo(String studyNo) {
		this.studyNo = studyNo;
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

	public String getExamClass() {
		return examClass;
	}

	public void setExamClass(String examClass) {
		this.examClass = examClass;
	}

	public String getExamItems() {
		return examItems;
	}

	public void setExamItems(String examItems) {
		this.examItems = examItems;
	}

	public String getExamOrgans() {
		return examOrgans;
	}

	public void setExamOrgans(String examOrgans) {
		this.examOrgans = examOrgans;
	}

	public String getExamTime() {
		return examTime;
	}

	public void setExamTime(String examTime) {
		this.examTime = examTime;
	}

	public String getImageCount() {
		return imageCount;
	}

	public void setImageCount(String imageCount) {
		this.imageCount = imageCount;
	}

	public String getIcCard() {
		return icCard;
	}

	public void setIcCard(String icCard) {
		this.icCard = icCard;
	}

	public String getMiCard() {
		return miCard;
	}

	public void setMiCard(String miCard) {
		this.miCard = miCard;
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

	public String getHospitalName() {
		return hospitalName;
	}

	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}

	public int getRows() {
		return rows;
	}

	public void setRows(int rows) {
		this.rows = rows;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public String getHospitalCode() {
		return hospitalCode;
	}

	public void setHospitalCode(String hospitalCode) {
		this.hospitalCode = hospitalCode;
	}

	public int getSampleAmount() {
		return sampleAmount;
	}

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

	public String getReqDept() {
		return reqDept;
	}

	public void setReqDept(String reqDept) {
		this.reqDept = reqDept;
	}

	public void setSampleAmount(int sampleAmount) {
		this.sampleAmount = sampleAmount;
	}

	public int getSampleField() {
		return sampleField;
	}

	public void setSampleField(int sampleField) {
		this.sampleField = sampleField;
	}

	public String getRownumList() {
		return rownumList;
	}

	public void setRownumList(String rownumList) {
		this.rownumList = rownumList;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public String getExamStatus() {
		return examStatus;
	}

	public void setExamStatus(String examStatus) {
		this.examStatus = examStatus;
	}

	public String getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(String reportStatus) {
		this.reportStatus = reportStatus;
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

	public String getStartApm() {
		return startApm;
	}

	public void setStartApm(String startApm) {
		this.startApm = startApm;
	}

	public String getEndApm() {
		return endApm;
	}

	public void setEndApm(String endApm) {
		this.endApm = endApm;
	}

	public String getDevice() {
		return device;
	}

	public void setDevice(String device) {
		this.device = device;
	}

	public Boolean getCheckOnly() {
		return checkOnly;
	}

	public void setCheckOnly(Boolean checkOnly) {
		this.checkOnly = checkOnly;
	}

	public String getDisease() {
		return disease;
	}

	public void setDisease(String disease) {
		this.disease = disease;
	}

	public String getRegister() {
		return register;
	}

	public void setRegister(String register) {
		this.register = register;
	}

	public String getQcItem() {
		return qcItem;
	}

	public void setQcItem(String qcItem) {
		this.qcItem = qcItem;
	}

	public String getQcStandard() {
		return qcStandard;
	}

	public void setQcStandard(String qcStandard) {
		this.qcStandard = qcStandard;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getIdentityCard() {
		return identityCard;
	}

	public void setIdentityCard(String identityCard) {
		this.identityCard = identityCard;
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

	public String getReqPhysician() {
		return reqPhysician;
	}

	public void setReqPhysician(String reqPhysician) {
		this.reqPhysician = reqPhysician;
	}

	public String getPatientSource() {
		return patientSource;
	}

	public void setPatientSource(String patientSource) {
		this.patientSource = patientSource;
	}

	public String getExamSubClass() {
		return examSubClass;
	}

	public void setExamSubClass(String examSubClass) {
		this.examSubClass = examSubClass;
	}

	public String getScheduleTime() {
		return scheduleTime;
	}

	public void setScheduleTime(String scheduleTime) {
		this.scheduleTime = scheduleTime;
	}

	public String getReportDate() {
		return reportDate;
	}

	public void setReportDate(String reportDate) {
		this.reportDate = reportDate;
	}

	public String getKeyImageCount() {
		return keyImageCount;
	}

	public void setKeyImageCount(String keyImageCount) {
		this.keyImageCount = keyImageCount;
	}

	public String getBedNo() {
		return bedNo;
	}

	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
	}

	public String getExamMode() {
		return examMode;
	}

	public void setExamMode(String examMode) {
		this.examMode = examMode;
	}

	public String getSickId() {
		return sickId;
	}

	public void setSickId(String sickId) {
		this.sickId = sickId;
	}

	public Integer getExamCount() {
		return examCount;
	}

	public void setExamCount(Integer examCount) {
		this.examCount = examCount;
	}

	public Boolean getIsRelative() {
		return isRelative;
	}

	public void setIsRelative(Boolean isRelative) {
		this.isRelative = isRelative;
	}

	public List<DictExamClass> getExamClassList() {
		return examClassList;
	}

	public void setExamClassList(List<DictExamClass> examClassList) {
		this.examClassList = examClassList;
	}

	public List<DictDept> getReqDepts() {
		return reqDepts;
	}

	public void setReqDepts(List<DictDept> reqDepts) {
		this.reqDepts = reqDepts;
	}
}
