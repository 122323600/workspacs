package com.ylz.util;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

public class JsonUtil {
	
	
	
	/**
	 * 
	 * @MethodName: toJson
	 * @Description: 对象转json 这里采用Gson来解析,因为gson排序默认 取bean中的字段顺序
	 * 而fastJson则按照字母排序
	 * @param obj
	 * @return
	 * @author 周昭名
	 * @date 2016年11月15日 上午9:09:01
	 */
	public static String toJson(Object obj) {
		Gson gson = new GsonBuilder()  
				  .setDateFormat("yyyy-MM-dd HH:mm:ss")  
				  .create(); 
		return gson.toJson(obj);
	}
	
	
	
	/**
	 * 
	 * @MethodName: json2Map
	 * @Description: 将json转化为map 这里采用fastJson转map 解决Gson中整数、长整数自动转化为double类型的问题
	 * @param jsonString
	 * @return
	 * @author 周昭名 
	 * @date 2016年11月15日 上午9:09:24
	 */
	public static Map<String, Object> json2Map(String jsonString){
	   TreeMap<String, Object> map= JSON.parseObject(jsonString,TreeMap.class);
       return map;
    }
	
	/**
	 * 
	 * @MethodName: json2List
	 * @Description: 把JSON文本parse成JavaBean集合 这里采用fastJson
	 * @param jsonString
	 * @param clazz
	 * @return
	 * @author 罗航
	 * @date 2016年11月30日 下午4:22:50
	 */
	public static <T>List<T> json2List(String jsonString,Class<T> clazz){
	   List<T> list= JSON.parseArray(jsonString, clazz);
       return list;
    }
	
	/**
	 * 
	 * @MethodName: json2Bean
	 * @Description: 把JSON文本parse为JavaBean 这里采用fastJson
	 * @param jsonString
	 * @param clazz
	 * @return
	 * @author 罗航
	 * @date 2016年11月30日 下午4:36:15
	 */
	public static  <T> T json2Bean(String jsonString,Class<T> clazz){
       return JSON.parseObject(jsonString,clazz);
    }
	

	
	/**
	 * 
	 * @MethodName: jsonObj2Bean
	 * @Description:把JSONObject 转化为javaBean 
	 * @param jsonObj
	 * @param clazz
	 * @return
	 * @author 周昭名
	 * @date 2016年12月8日 上午11:13:40
	 */
	public static  <T> T  jsonObj2Bean(JsonObject obj,Class<T> clazz){
		String jsonStr = JSON.toJSONString(obj);
		return JSON.parseObject(jsonStr,clazz);
	}
	
}
