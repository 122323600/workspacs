package com.ylz.common.dto;

import java.math.BigDecimal;
import java.util.List;

public class ExamOrgan {

	private String examNo;
	private BigDecimal organNo;
	private String organCode;
	private String organName;
	private String nameEnglish;
	
	private List<String> examNoList;
	
	public ExamOrgan(){
		
	}

	public String getExamNo() {
		return examNo;
	}

	public void setExamNo(String examNo) {
		this.examNo = examNo;
	}

	public BigDecimal getOrganNo() {
		return organNo;
	}

	public void setOrganNo(BigDecimal organNo) {
		this.organNo = organNo;
	}

	public String getOrganCode() {
		return organCode;
	}

	public void setOrganCode(String organCode) {
		this.organCode = organCode;
	}

	public String getOrganName() {
		return organName;
	}

	public void setOrganName(String organName) {
		this.organName = organName;
	}

	public String getNameEnglish() {
		return nameEnglish;
	}

	public void setNameEnglish(String nameEnglish) {
		this.nameEnglish = nameEnglish;
	}

	public List<String> getExamNoList() {
		return examNoList;
	}

	public void setExamNoList(List<String> examNoList) {
		this.examNoList = examNoList;
	}
}
