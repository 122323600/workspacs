package com.ylz.common.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;

import com.ylz.common.dto.ExamItem;
import com.ylz.common.dto.ExamOrgan;
import com.ylz.common.dto.PageExamStudy;
import com.ylz.common.dto.PageImageInfo;
import com.ylz.common.dto.PageQuery;
import com.ylz.common.dto.PageRpt;
import com.ylz.common.dto.StudyImage;
import com.ylz.common.dto.Studys;

public interface QueryMapper {
	
	public List<PageQuery> findCaseHistory(PageQuery dto);
	
	public List<PageQuery> findCaseHistory(PageQuery dto, RowBounds rowBounds);
	
	public List<PageQuery> sampleCaseHistory(PageQuery dto, RowBounds rowBounds);
	
	public int findCaseHistoryCount(PageQuery dto);
	
	public List<StudyImage> findImageList(Studys dto);
	
	public PageRpt findReport(PageRpt dto);
	
	public List<ExamOrgan> findExamOrgansByExamNos(ExamOrgan dto);
	
	public List<ExamItem> findExamItemsByExamNos(ExamItem dto);
	
	public List<ExamOrgan> findExamOrgansByExamNo(ExamOrgan dto);
	
	public List<ExamItem> findExamItemsByExamNo(ExamItem dto);
	
	public PageImageInfo findImageInfo(PageImageInfo dto);
	
	public PageExamStudy findExamStudyByApplyNo(PageExamStudy dto);
	
	public PageExamStudy findExamStudyByExamNo(PageExamStudy dto);
	
	public String findExamNoByApplyNo(String applyNo);
	
	public String findExamNoByOrderNo(String orderNo);

	public List<String> getStudyImageName(Map<String, Object> m);

}
