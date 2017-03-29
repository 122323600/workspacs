package com.ylz.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ylz.common.dto.ExamItem;
import com.ylz.common.dto.ExamOrgan;
import com.ylz.common.dto.PageExamStudy;
import com.ylz.common.dto.PageImageInfo;
import com.ylz.common.dto.PageQuery;
import com.ylz.common.dto.PageRpt;
import com.ylz.common.dto.StudyImage;
import com.ylz.common.dto.Studys;
import com.ylz.common.mapper.QueryMapper;
import com.ylz.util.ConfigUtil;

@Service("queryService")
public class QueryService {

	@Autowired
	private QueryMapper queryMapper;
	
	public List<Object> findCaseHistory(PageQuery dto){
		List<Object> retList = new ArrayList<Object>();
		int page = dto.getPage();
		int pageSize = dto.getRows();
		int offset = 0;
		if(ConfigUtil.getExamClasses().size()>0){dto.setExamClassList(ConfigUtil.getExamClasses());}
		int count = queryMapper.findCaseHistoryCount(dto);
		if(page==1 && count<pageSize){
			offset = 0;
		} else {
			offset = (page - 1) * pageSize;
		}
		RowBounds rowBounds = new RowBounds(offset, pageSize);
		List<PageQuery> queryList=null;
		
		if(count>0){
			queryList=queryMapper.findCaseHistory(dto, rowBounds);
		}else if(count==0&&ConfigUtil.isIgnoreTime()
				&& (StringUtils.isNotBlank(dto.getName())
						|| StringUtils.isNotBlank(dto.getPatLocalId())
						|| StringUtils.isNotBlank(dto.getOutpatientNo())
						|| StringUtils.isNotBlank(dto.getInpatientNo()))){
			dto.setStartTime(null);
			dto.setEndTime(null);
			count=queryMapper.findCaseHistoryCount(dto);
			if(count>0)queryList=queryMapper.findCaseHistory(dto, rowBounds);
			
		}
		if(queryList!=null){
			Map<String, PageQuery> map = new HashMap<String, PageQuery>();
			String examNoStr = "''";
			for(int i=0; i<queryList.size(); i++){
				PageQuery pageQuery = queryList.get(i);
				examNoStr = examNoStr + ",'" + pageQuery.getExamNo() + "'";
				map.put(pageQuery.getExamNo(), null);
			}

			examNoStr = "(" + examNoStr + ")";
			
			ExamItem examItem = new ExamItem();
			examItem.setExamNo(examNoStr);
			List<ExamItem> itemList = queryMapper.findExamItemsByExamNos(examItem);
			
			if(itemList!=null){
				for(int i=0; i<itemList.size(); i++){
					ExamItem item = itemList.get(i);
					PageQuery tmp = map.get(item.getExamNo());
					if(tmp!=null){
						if(StringUtils.trimToNull(tmp.getExamItems())!=null){
							tmp.setExamItems(tmp.getExamItems()+"," + item.getItemName());
						}else{
							tmp.setExamItems(item.getItemName());
						}
					} else {
						PageQuery q=new PageQuery();
						q.setExamItems(item.getItemName());
						map.put(item.getExamNo(), q);
					}
				}
			}
			
			ExamOrgan examOrgan=new ExamOrgan();
			examOrgan.setExamNo(examNoStr);
			List<ExamOrgan> organList = queryMapper.findExamOrgansByExamNos(examOrgan);
			if(organList!=null){
				for(int i=0; i<organList.size(); i++){
					ExamOrgan organ = organList.get(i);
					PageQuery tmp = map.get(organ.getExamNo());
					if(tmp!=null){
						if(StringUtils.trimToNull(tmp.getExamOrgans())!=null){
							tmp.setExamOrgans(tmp.getExamOrgans()+"," + organ.getOrganName());
						}else{
							tmp.setExamOrgans(organ.getOrganName());
						}
					} else {
						PageQuery q=new PageQuery();
						q.setExamOrgans(organ.getOrganName());
						map.put(organ.getExamNo(), q);
					}
				}
			}
			
			for(int i=0; i<queryList.size(); i++){
				PageQuery pageQuery = queryList.get(i);
				
				PageQuery p = map.get(pageQuery.getExamNo());
				if(pageQuery!=null&&p!=null){
					pageQuery.setExamItems(p.getExamItems());
					pageQuery.setExamOrgans(p.getExamOrgans());	
				}
			}
		}
		retList.add(count + "");
		retList.add(queryList);
		return retList;
	}	
	
	public List<PageQuery> relativeCaseHistory(PageQuery dto){
		dto.setIsRelative(true);
		List<PageQuery> queryList=queryMapper.findCaseHistory(dto);
		if(queryList!=null){
			Map<String, PageQuery> map = new HashMap<String, PageQuery>();
			String examNoStr = "''";
			for(int i=0; i<queryList.size(); i++){
				PageQuery pageQuery = queryList.get(i);
				examNoStr = examNoStr + ",'" + pageQuery.getExamNo() + "'";
				map.put(pageQuery.getExamNo(), null);
			}

			examNoStr = "(" + examNoStr + ")";
			
			ExamItem examItem = new ExamItem();
			examItem.setExamNo(examNoStr);
			List<ExamItem> itemList = queryMapper.findExamItemsByExamNos(examItem);
			
			if(itemList!=null){
				for(int i=0; i<itemList.size(); i++){
					ExamItem item = itemList.get(i);
					PageQuery tmp = map.get(item.getExamNo());
					if(tmp!=null){
						if(StringUtils.trimToNull(tmp.getExamItems())!=null){
							tmp.setExamItems(tmp.getExamItems()+"," + item.getItemName());
						}else{
							tmp.setExamItems(item.getItemName());
						}
					} else {
						PageQuery q=new PageQuery();
						q.setExamItems(item.getItemName());
						map.put(item.getExamNo(), q);
					}
				}
			}
			
			ExamOrgan examOrgan=new ExamOrgan();
			examOrgan.setExamNo(examNoStr);
			List<ExamOrgan> organList = queryMapper.findExamOrgansByExamNos(examOrgan);
			if(organList!=null){
				for(int i=0; i<organList.size(); i++){
					ExamOrgan organ = organList.get(i);
					PageQuery tmp = map.get(organ.getExamNo());
					if(tmp!=null){
						if(StringUtils.trimToNull(tmp.getExamOrgans())!=null){
							tmp.setExamOrgans(tmp.getExamOrgans()+"," + organ.getOrganName());
						}else{
							tmp.setExamOrgans(organ.getOrganName());
						}
					} else {
						PageQuery q=new PageQuery();
						q.setExamOrgans(organ.getOrganName());
						map.put(organ.getExamNo(), q);
					}
				}
			}
			
			for(int i=0; i<queryList.size(); i++){
				PageQuery pageQuery = queryList.get(i);
				
				PageQuery p = map.get(pageQuery.getExamNo());
				if(pageQuery!=null&&p!=null){
					pageQuery.setExamItems(p.getExamItems());
					pageQuery.setExamOrgans(p.getExamOrgans());	
				}
			}
		}
		return queryList;
	}
	
	public int findCaseHistoryCount(PageQuery dto){
		return queryMapper.findCaseHistoryCount(dto);
	}

	public List<StudyImage> findImageList(Studys dto){
		return queryMapper.findImageList(dto);
	}
	
	public PageRpt findReport(PageRpt dto){
		return queryMapper.findReport(dto);
	}
	
	public List<ExamOrgan> findExamOrgansByExamNos(ExamOrgan dto){
		return queryMapper.findExamOrgansByExamNos(dto);
	}
	
	public List<ExamItem> findExamItemsByExamNos(ExamItem dto){
		return queryMapper.findExamItemsByExamNos(dto);
	}
	
	public List<ExamOrgan> findExamOrgansByExamNo(ExamOrgan dto){
		return queryMapper.findExamOrgansByExamNo(dto);
	}
	
	public List<ExamItem> findExamItemsByExamNo(ExamItem dto){
		return queryMapper.findExamItemsByExamNo(dto);
	}
	
	public PageImageInfo findImageInfo(PageImageInfo dto){
		return queryMapper.findImageInfo(dto);
	}
	
	public PageExamStudy findExamStudyByApplyNo(PageExamStudy dto){
		return queryMapper.findExamStudyByApplyNo(dto);
	}
	
	public PageExamStudy findExamStudyByExamNo(PageExamStudy dto){
		return queryMapper.findExamStudyByExamNo(dto);
	}
	
	public List<Object> sampleCaseHistory(PageQuery dto){
		List<Object> retList = new ArrayList<Object>();
		int page = dto.getPage();
		int pageSize = dto.getRows();
		int offset = 0;
		int count = dto.getTotal();
		if(page==1 && count<pageSize){
			offset = 0;
		} else {
			offset = (page - 1) * pageSize;
		}
		RowBounds rowBounds = new RowBounds(offset, pageSize);
		List<PageQuery> queryList = queryMapper.sampleCaseHistory(dto, rowBounds);
		if(queryList!=null){
			Map<String, PageQuery> map = new HashMap<String, PageQuery>();
			String examNoStr = "''";
			for(int i=0; i<queryList.size(); i++){
				PageQuery pageQuery = queryList.get(i);
				examNoStr = examNoStr + ",'" + pageQuery.getExamNo() + "'";
				map.put(pageQuery.getExamNo(), null);
			}

			examNoStr = "(" + examNoStr + ")";
			
			ExamItem examItem = new ExamItem();
			examItem.setExamNo(examNoStr);
			List<ExamItem> itemList = queryMapper.findExamItemsByExamNos(examItem);
			
			if(itemList!=null){
				for(int i=0; i<itemList.size(); i++){
					ExamItem item = itemList.get(i);
					PageQuery tmp = map.get(item.getExamNo());
					if(tmp!=null){
						if(StringUtils.trimToNull(tmp.getExamItems())!=null){
							tmp.setExamItems(tmp.getExamItems()+"," + item.getItemName());
						}else{
							tmp.setExamItems(item.getItemName());
						}
					} else {
						PageQuery q=new PageQuery();
						q.setExamItems(item.getItemName());
						map.put(item.getExamNo(), q);
					}
				}
			}
			
			ExamOrgan examOrgan=new ExamOrgan();
			examOrgan.setExamNo(examNoStr);
			List<ExamOrgan> organList = queryMapper.findExamOrgansByExamNos(examOrgan);
			if(organList!=null){
				for(int i=0; i<organList.size(); i++){
					ExamOrgan organ = organList.get(i);
					PageQuery tmp = map.get(organ.getExamNo());
					if(tmp!=null){
						if(StringUtils.trimToNull(tmp.getExamOrgans())!=null){
							tmp.setExamOrgans(tmp.getExamOrgans()+"," + organ.getOrganName());
						}else{
							tmp.setExamOrgans(organ.getOrganName());
						}
					} else {
						PageQuery q=new PageQuery();
						q.setExamOrgans(organ.getOrganName());
						map.put(organ.getExamNo(), q);
					}
				}
			}
			
			for(int i=0; i<queryList.size(); i++){
				PageQuery pageQuery = queryList.get(i);
				
				PageQuery p = map.get(pageQuery.getExamNo());
				if(pageQuery!=null&&p!=null){
					pageQuery.setExamItems(p.getExamItems());
					pageQuery.setExamOrgans(p.getExamOrgans());	
				}
			}
		}
		
		retList.add(count + "");
		retList.add(queryList);
		return retList;
	}
	
	public String findExamNoByApplyNo(String applyNo){
		return queryMapper.findExamNoByApplyNo(applyNo);
	}
	
	public String findExamNoByOrderNo(String orderNo){
		return queryMapper.findExamNoByOrderNo(orderNo);
	}

	public List<String> getStudyImageName(Map<String, Object> m) {
		return queryMapper.getStudyImageName(m);
	}
}
