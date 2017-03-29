package com.ylz.common.dto;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 检查类别字典
 * @author zqr
 */
public class DictExamClass implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private String examClassName;		//检查类别名称 - 主键
	private String examClassCode;		//检查类别代码
	private String inputCode;			//输入码
	private BigDecimal sortNo;				//排序号
	
	public String getExamClassName() {
		return examClassName;
	}
	public void setExamClassName(String examClassName) {
		this.examClassName = examClassName;
	}
	public String getExamClassCode() {
		return examClassCode;
	}
	public void setExamClassCode(String examClassCode) {
		this.examClassCode = examClassCode;
	}
	public String getInputCode() {
		return inputCode;
	}
	public void setInputCode(String inputCode) {
		this.inputCode = inputCode;
	}
	public BigDecimal getSortNo() {
		return sortNo;
	}
	public void setSortNo(BigDecimal sortNo) {
		this.sortNo = sortNo;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((examClassName == null) ? 0 : examClassName.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DictExamClass other = (DictExamClass) obj;
		if (examClassName == null) {
			if (other.examClassName != null)
				return false;
		} else if (!examClassName.equals(other.examClassName))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "DictExamClass [examClassCode=" + examClassCode
				+ ", examClassName=" + examClassName + ", inputCode="
				+ inputCode + ", sortNo=" + sortNo + "]";
	}	
}
