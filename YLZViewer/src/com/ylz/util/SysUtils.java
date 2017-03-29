package com.ylz.util;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

public class SysUtils {
	//private static final Logger logger = LoggerFactory.getLogger(SysUtils.class);
	private SysUtils(){}
	
	static{
		//设置时区
		System.setProperty("user.timezone","Asia/Shanghai"); 
	}
	
	public static String getGuid(){
		return UUID.randomUUID().toString();
	}
	
	public static String getMD5(String source){
		String ret = null;
		if(source!=null) ret = getMD5(source.getBytes());
		return ret;
	}
	
	public static String getMD5(byte[] source) {
		String s = null;
		char hexDigits[] = { // 用来将字节转换成 16 进制表示的字符
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
				'e', 'f' };
		try {
			java.security.MessageDigest md = java.security.MessageDigest
					.getInstance("MD5");
			md.update(source);
			byte tmp[] = md.digest(); // MD5 的计算结果是一个 128 位的长整数，
			// 用字节表示就是 16 个字节
			char str[] = new char[16 * 2]; // 每个字节用 16 进制表示的话，使用两个字符，
			// 所以表示成 16 进制需要 32 个字符
			int k = 0; // 表示转换结果中对应的字符位置
			for (int i = 0; i < 16; i++) { // 从第一个字节开始，对 MD5 的每一个字节
				// 转换成 16 进制字符的转换
				byte byte0 = tmp[i]; // 取第 i 个字节
				str[k++] = hexDigits[byte0 >>> 4 & 0xf]; // 取字节中高 4 位的数字转换,
				// >>> 为逻辑右移，将符号位一起右移
				str[k++] = hexDigits[byte0 & 0xf]; // 取字节中低 4 位的数字转换
			}
			s = new String(str); // 换后的结果转换为字符串

		} catch (Exception e) {
			e.printStackTrace();
		}
		return s;
	}
	
	public static String urlDecode(String str){
		if(str==null) return str;
		String ret = null;
		try {
			ret = java.net.URLDecoder.decode(str,"UTF-8");
		} catch (UnsupportedEncodingException e) {
		}
		return ret;
	}
	
	public static long parseLong(String name, int defaultLong){
		long ret = defaultLong;
		if(name==null) return ret;
		try{
			ret = Long.parseLong(name);
		} catch(Exception e){
		}
		return ret;
	}
	
	public static int parseInt(String name, int defaultLong){
		int ret = defaultLong;
		if(name==null) return ret;
		try{
			ret = Integer.parseInt(name);
		} catch(Exception e){
		}
		return ret;
	}
	
	/**
	 * 
	 * @param content
	 * @param map
	 * @return
	 * add by lvzf 转换短信内容
	 */
	public static String convertSMS(String content,Map<String,String> map){
		if(content==null||"".equals(content)||map==null)
			return null;
		for (Map.Entry<String,String> entry : map.entrySet()) {
			String key=entry.getKey().toString();
			String value="";
			if(entry.getValue()!=null){
				value=entry.getValue().toString();
			}else{
				value="";
			}
			content=content.replaceAll(key, value);
		}
		return content;
	}
	
	private static String[] DATE_PATTERN =  new String[]{"yyyy-MM-dd"};
	
	private static String[] TIME_PATTERN = new String[]{"HH:mm"};
	
	private static String[] DATE_TIME_PATTERN=new String[]{"yyyy-MM-dd HH:mm:ss"};
	//add by lijh 
	//private static String[] DATE_TIME_PATTERN=new String[]{"yyyy-MM-dd HH:mm"};
	public static String dateFormat(Date date){
		return date==null ? null : DateFormatUtils.format(date, DATE_PATTERN[0]);
	}
	
	public static Date dateParse(String date) throws ParseException{
		return date==null ? null : DateUtils.parseDate(date, DATE_PATTERN);
	}
	
	public static Date dateTimeParse(String date) {
		try {
			return date==null ? null : DateUtils.parseDate(date, DATE_TIME_PATTERN);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String dateTimeFormat(Date date){
		return date==null ? null : DateFormatUtils.format(date, DATE_TIME_PATTERN[0]);
	}
	
	public static Date dateParseWithoutExc(String date){
		try {
			return date==null ? null : DateUtils.parseDate(date, DATE_PATTERN);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static String commonDateFormatWithoutExc(Date date, String pattern){
		return date==null ? null : DateFormatUtils.format(date, pattern);
	}
	
	public static String timeFormat(Date date){
		return date==null ? null : DateFormatUtils.format(date, TIME_PATTERN[0]);
	}
	
	public static Date timeParse(String date){
		try {
			return date==null ? null : DateUtils.parseDate(date, TIME_PATTERN);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 生成随机密码
	 * add by linrg 2012年7月29日
	 * @return
	 */
	public static String getRandomPWD(){
		int[] array = {0,1,2,3,4,5,6,7,8,9};
        Random rand = new Random();
        for (int i = 10; i > 1; i--) {
            int index = rand.nextInt(i);
            int tmp = array[index];
            array[index] = array[i - 1];
            array[i - 1] = tmp;
        }
        int result = 0;
        for(int i = 0; i < 6; i++)
            result = result * 10 + array[i];
        return result+"";
	}
	
	public static Date getLimitDate(Date date,String limit){
		limit = StringUtils.trimToNull(limit);
		if(limit==null) limit = "1_22:00";
		Pattern pat = Pattern.compile("(\\d+)_(\\d{2}:\\d{2})");
		Matcher mat = pat.matcher(limit);
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		Date ret = date;
		try {
			int day = 1;
			Date time = sdf.parse("22:00");
			if(mat.find()){
				day = Integer.parseInt(mat.group(1));
				time = sdf.parse(mat.group(2));
			}
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.MILLISECOND, 0);
			cal.add(Calendar.DAY_OF_YEAR, day * -1);
			cal.add(Calendar.MILLISECOND, (int)time.getTime());
			ret = cal.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ret;
	}
	
	/**
	 * 获取日期类型的当前日期
	 * @return
	 */
	public static Date getCurDate(){
		return Calendar.getInstance().getTime();
	}
	
	/**
	 * @param pattern
	 *            - 日期格式
	 * @param field
	 *            - 给定的日历字段。
	 * @param value
	 *            - 给定日历字段所要设置的值。
	 * @return
	 */
	public static Date getIntervalDate(int field, int interval) {
		return getIntervalDate(getCurDate(), "yyyy-MM-dd", field, interval);
	}
	
	/**
	 * @param pattern
	 *            - 日期格式
	 * @param field
	 *            - 给定的日历字段。
	 * @param value
	 *            - 给定日历字段所要设置的值。
	 * @return
	 */
	public static Date getIntervalDate(Date date, String pattern, int field,
			int interval) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		int fieldValue = cal.get(field);
		cal.set(field, fieldValue + interval);
		return cal.getTime();
	}
	
	public static Date parseTime(String str, String defaultTime){
		Date retDate = null;
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		try{
			retDate = sdf.parse(str);
		} catch(Exception e){
			try {
				retDate = sdf.parse(defaultTime);
			} catch (ParseException e1) {
			}
		}
		return retDate;
	}
	
	/**
	 * 判断对象是否为空，为空返回""
	 * @param obj
	 * @return
	 */
	public static String checkEmpty(Object obj) {
		String str = "";
		if(obj!=null){
			return obj.toString();
		}
		else return str;
	}
}
