package com.ylz.common.mapper;

import java.util.List;

import com.ylz.common.dto.Serie;
import com.ylz.common.dto.Study;

public interface SerieMapper {

	public List<Serie> findByStudyNo(String studyNo);

	public List<Serie> findByStudy(Study Study);
}
