package com.ylz.common.mapper;

import java.util.List;

import com.ylz.common.dto.Image;

public interface ImageMapper {
	
	public List<Image> findBySerieUid(String seriesUid);
	
	public List<Image> findCommonImageBySerieUid(String seriesUid);	
}
