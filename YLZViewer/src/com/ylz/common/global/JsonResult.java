package com.ylz.common.global;

import java.io.Serializable;
import java.util.List;

/**
 * 
 * @ClassName: JsonResult.java
 * @Description: 封装json对象公用方法 result用于返回多条数据
 * @Copyright: Copyright (c) 2016
 * @company 易联众远程医疗事业部
 * @author 周昭名
 * @date 2016年10月27日 下午1:09:59
 * @version V1.0
 * @param <T>
 */
public class JsonResult implements Serializable {

	private static final long serialVersionUID = -8533726253476277025L;
	private String status;// 请求状态
	private String message;// 请求应答信息
	// 分页信息 只有当 分页查询时 才在此page中设置
	private PageVO page;
	private List result; // 返回结果集

	private Object obj;

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}

	public JsonResult() {
		super();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String meassge) {
		this.message = meassge;
	}

	public List getResult() {
		return result;
	}

	public void setResult(List result) {
		this.result = result;
	}

	public PageVO getPage() {
		return page;
	}

	public void setPage(PageVO page) {
		this.page = page;
	}

}
