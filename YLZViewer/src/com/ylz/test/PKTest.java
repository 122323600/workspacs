package com.ylz.test;

import com.ylz.util.PKGenerator;

/**
 * 
 * @ClassName: PKTest.java 
 * @Description: 主键生成测试用例
 * @Copyright: Copyright (c) 2016 
 * @company 易联众远程医疗事业部 
 * @author 周昭名
 * @date 2016年10月13日 下午4:30:30 
 * @version V1.0
 */
public class PKTest {

	public static void main(String[] args) {
		
		Long PKSimple = PKGenerator.getInstance().nextPK();
		System.out.println(PKSimple);
	}
	
	
}
