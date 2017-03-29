package com.ylz.common.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ylz.common.dto.ExamStudy;
import com.ylz.common.dto.StudySeries;
import com.ylz.common.dto.Studys;
import com.ylz.common.mapper.ExamImageMapper;

@Service("examImageService")
public class ExamImageService {

	@Autowired
	private ExamImageMapper examImageMapper;
	
	public List<Studys> findStudysByExamNo(String examNo){
		return examImageMapper.findStudysByExamNo(examNo);
	}
	
	public List<ExamStudy> findExamStudys(ExamStudy dto){
		return examImageMapper.findExamStudys(dto);
	}

	public List<StudySeries> findStudySeries(ExamStudy dto) {
		return examImageMapper.findStudySeries(dto);
	}
	
	public int getPrivateImageCount(String studyNo){
		return examImageMapper.getPrivateImageCount(studyNo);
	}
	
	public List<String> getUnPrivateImages(String studyNo){
		return examImageMapper.getUnPrivateImages(studyNo);
	}
}
