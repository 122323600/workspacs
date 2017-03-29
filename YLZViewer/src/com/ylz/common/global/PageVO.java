package com.ylz.common.global;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class PageVO {

	@NotNull(message="pageNo不能为空")
	@Min(value=1,message="pageNo的值必须大于等于1")
	private int pageNo;
	
	@NotNull(message="pageSize不能为空")
	@Min(value=1,message="pageSize的值必须大于等于1")
	private int pageSize;
	private Long total;
	
	public int getPageNo() {
		return pageNo;
	}
	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public Long getTotal() {
		return total;
	}
	public void setTotal(Long total) {
		this.total = total;
	}
}