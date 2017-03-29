package com.ylz.common.dto;

import java.io.Serializable;

/**
 * 检查与图像关联表
 * @author zqr
 */
public class ExamStudy implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 默认构造函数
	 */
	public ExamStudy() {
	}

	private String examNo; 		//检查流水号
	private String studyNo; 	//检查号
	
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
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((examNo == null) ? 0 : examNo.hashCode());
		result = prime * result + ((studyNo == null) ? 0 : studyNo.hashCode());
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
		ExamStudy other = (ExamStudy) obj;
		if (examNo == null) {
			if (other.examNo != null)
				return false;
		} else if (!examNo.equals(other.examNo))
			return false;
		if (studyNo == null) {
			if (other.studyNo != null)
				return false;
		} else if (!studyNo.equals(other.studyNo))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "ExamStudyDTO [examNo=" + examNo + ", studyNo=" + studyNo + "]";
	}
	
}
