package com.ylz.common.mapper;

import java.util.List;

import com.ylz.common.dto.ExamStudy;
import com.ylz.common.dto.StudySeries;
import com.ylz.common.dto.Studys;

public interface ExamImageMapper {

	public List<Studys> findStudysByExamNo(String examNo);
	
	public List<ExamStudy> findExamStudys(ExamStudy dto);

	public List<StudySeries> findStudySeries(ExamStudy dto);
	
	public int getPrivateImageCount(String studyNo);
	
	public List<String> getUnPrivateImages(String studyNo);
}
