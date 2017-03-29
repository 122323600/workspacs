package com.ylz.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ylz.common.dto.PageExamStudy;

@Controller("indexController")
public class IndexController {
	
	@RequestMapping("/index")
	public String index(@ModelAttribute PageExamStudy exam){
		return "image";
	}
}