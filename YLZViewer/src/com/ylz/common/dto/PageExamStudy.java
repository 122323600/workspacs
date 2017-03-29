package com.ylz.common.dto;

import java.io.Serializable;

public class PageExamStudy implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private String icCard; // 社保卡号
	private String miCard; // 医保卡号
	private String identityCard; // 身份证号
	private String examNo; // 检查流水号
	private String studyNo; // 检查序号
	private String applyNo; // 检查序号
	private String orderNo;//医嘱号
	
	private boolean success;
	private String errMsg;
	
	public PageExamStudy(){
		
	}
	public String getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
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
	public String getStudyNo() {
		return studyNo;
	}
	public void setStudyNo(String studyNo) {
		this.studyNo = studyNo;
	}
	public String getApplyNo() {
		return applyNo;
	}
	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}
	public String getIdentityCard() {
		return identityCard;
	}
	public void setIdentityCard(String identityCard) {
		this.identityCard = identityCard;
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
}
