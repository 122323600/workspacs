package com.ylz.test;

import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import com.ylz.common.global.PageVO;

public class ValidateTest {

	public static void main(String[] args) {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory(); 
		 Validator validator = factory.getValidator(); 
		PageVO page =  new PageVO();
		page.setPageNo(0);
		page.setPageSize(0);
		 
		 Set<ConstraintViolation<PageVO>> violations = validator.validate(page);
	}
}
