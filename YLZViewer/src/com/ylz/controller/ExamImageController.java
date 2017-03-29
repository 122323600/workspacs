package com.ylz.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ylz.common.dto.ExamStudy;
import com.ylz.common.dto.StudySeries;
import com.ylz.common.dto.Studys;
import com.ylz.common.service.ExamImageService;

@Controller("examImageController")
@RequestMapping("/img")
public class ExamImageController {
	
	@Autowired
	@Qualifier("examImageService")
	private ExamImageService examImageService;
	
	@RequestMapping(value="/getStudys")
	@ResponseBody
	public List<Studys> getReport(@RequestParam("examNo") String examNo){
		List<Studys> studys=new ArrayList<Studys>();
		
		if(StringUtils.isNotBlank(examNo)) {
			studys=examImageService.findStudysByExamNo(examNo);
		}
		return studys;
	}
	@RequestMapping(value="/getStudySeries")
	@ResponseBody
	public List<StudySeries> getStudySeries(@ModelAttribute ExamStudy examStudy){
		List<StudySeries> studys=new ArrayList<StudySeries>();
		if(examStudy!=null) {
			studys=examImageService.findStudySeries(examStudy);
		}
		return studys;
	}
}
