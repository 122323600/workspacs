package com.ylz.common.global;

/**
 * http请求响应状态码  备用  
 * @ClassName: HttpStatusCode.java 
 * @Description: TODO(一句话描述这个类的作用)
 * @Copyright: Copyright (c) 2016 
 * @company 易联众远程医疗事业部 
 * @author 周昭名
 * @date 2016年11月8日 下午11:33:00 
 * @version V1.0
 */
public class HttpStatusCode {
	
		//以下是http请求状态
		public static final int HTTP_ACCEPTED = 202;// HTTP 状态码 202：Accepted
		public static final int HTTP_BAD_GATEWAY = 502;// HTTP 状态码 502：Bad Gateway
		public static final int HTTP_BAD_METHOD = 405;// HTTP 状态码 405：Method Not Allowed
		public static final int HTTP_BAD_REQUEST = 400;// HTTP 状态码 400：Bad Request
		public static final int HTTP_CLIENT_TIMEOUT = 408;//HTTP 状态码 408：Request Time-Out
		public static final int HTTP_CONFLICT = 409;//HTTP 状态码 409：Conflict
		public static final int HTTP_CREATED=201;//HTTP 状态码 201：Created
		public static final int HTTP_ENTITY_TOO_LARGE=413;//HTTP 状态码 413：Request Entity Too Large
		public static final int HTTP_FORBIDDEN =403;//HTTP 状态码 403：Forbidden
		public static final int HTTP_GATEWAY_TIMEOUT=504;//HTTP 状态码 504：Gateway Timeout
		public static final int HTTP_GONE =410;//HTTP 状态码 410：Gone
		public static final int HTTP_INTERNAL_ERROR=500;//HTTP 状态码 500：Internal Server Error
		public static final int HTTP_LENGTH_REQUIRED =411;//HTTP 状态码 411：Length Required
		public static final int HTTP_MOVED_PERM =301;//HTTP 状态码 301：Moved Permanently
		public static final int HTTP_MOVED_TEMP =302;//HTTP 状态码 302：Temporary Redirect
		public static final int HTTP_MULT_CHOICE =300;//HTTP 状态码 300：Multiple Choices
		public static final int HTTP_NO_CONTENT =204;//HTTP 状态码 204：No Content
		public static final int HTTP_NOT_ACCEPTABLE =406;//HTTP 状态码 406：Not Acceptable
		public static final int HTTP_NOT_AUTHORITATIVE  =203;//HTTP 状态码 203：Non-Authoritative Information
		public static final int HTTP_NOT_FOUND  =404;//HTTP 状态码 404：Not Found
		public static final int HTTP_NOT_IMPLEMENTED = 501; // HTTP 状态码 501：Not Implemented。
		public static final int HTTP_NOT_MODIFIED = 304; // HTTP 状态码 304：Not  Modified。
		public static final int HTTP_OK = 200; // HTTP 状态码 200：OK。
		public static final int HTTP_PARTIAL = 206; // HTTP 状态码 206：Partial Content。
		public static final int HTTP_PAYMENT_REQUIRED = 402; // HTTP 状态码 402：Payment Required。
		public static final int HTTP_PRECON_FAILED = 412; // HTTP 状态码412：Precondition Failed。
		public static final int HTTP_PROXY_AUTH = 407; // HTTP 状态码 407：Proxy Authentication Required。
		public static final int HTTP_REQ_TOO_LONG = 414; // HTTP 状态码 414：Request-URI  Too Large。
		public static final int HTTP_RESET = 205; // HTTP 状态码 205：Reset Content。
		public static final int HTTP_SEE_OTHER = 303; // HTTP 状态码 303：See Other。
		public static final int HTTP_UNAUTHORIZED = 401; // HTTP 状态码 401：Unauthorized。
		public static final int HTTP_UNAVAILABLE = 503; // HTTP 状态码 503：Service Unavailable。
		public static final int HTTP_UNSUPPORTED_TYPE = 415; // HTTP 状态码 415 Unsupported Media Type。
		public static final int HTTP_USE_PROXY = 305; // HTTP 状态码 305：Use Proxy。
		public static final int HTTP_VERSION = 505;// HTTP 状态码 505：HTTP Version Not Supported。

}
