package com.ylz.common.dto;

import java.math.BigDecimal;

public class ExamItem {

	private String examNo;
	private BigDecimal itemNo;
	private String itemCode;
	private String itemName;
	private BigDecimal cost;
	private BigDecimal charge;
	private String applyNo;
	private String chargeFlag;
	private BigDecimal amount;
	private String orderNo;
	
	public ExamItem(){
		
	}
	
	public String getExamNo() {
		return examNo;
	}
	public void setExamNo(String examNo) {
		this.examNo = examNo;
	}
	public BigDecimal getItemNo() {
		return itemNo;
	}
	public void setItemNo(BigDecimal itemNo) {
		this.itemNo = itemNo;
	}
	public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public BigDecimal getCost() {
		return cost;
	}
	public void setCost(BigDecimal cost) {
		this.cost = cost;
	}
	public BigDecimal getCharge() {
		return charge;
	}
	public void setCharge(BigDecimal charge) {
		this.charge = charge;
	}
	public String getApplyNo() {
		return applyNo;
	}
	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}
	public String getChargeFlag() {
		return chargeFlag;
	}
	public void setChargeFlag(String chargeFlag) {
		this.chargeFlag = chargeFlag;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

}
