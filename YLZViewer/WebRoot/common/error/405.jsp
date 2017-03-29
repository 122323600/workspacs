<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html>
<head>
<base href="<%=basePath%>">
<title>错误页-404</title>
<%@ include file="/common/common.jsp"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="vs_defaultClientScript" content="JavaScript">
<meta name="vs_targetSchema"
	content="http://schemas.microsoft.com/intellisense/ie5">
<link rel="icon" href="images/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="images/favicon.ico"
	mce_href="images/favicon.ico" type="image/x-icon" />
<script src="${ctx}/static/js/main.js"></script>
<style type="text/css">
* {padding: 0;margin: 0}
body{background: #edeef4;}
img {border: none}
#main{width: 800px;height: 600px;border: 0px solid red;position: fixed;left: 50%;top: 50%;margin-left: -390px;margin-top: -300px;
		_position: absolute; _top: expression(eval(document.documentElement.clientHeight/2+document.documentElement.scrollTop;));
		_left: expression(eval(document.documentElement.clientWidth/2+document.documentElement.scrollLeft;));
	}
#main .m_img{width: 400px;height: 800px;margin-left: 20px;float: left;padding-top: 100px;}
#main .m_reason{width: 350px;height: 800px;margin-left: 30px;margin-top: 200px;float: left;}
#main .m_reason p{font-size: 30px;font-family: "微软雅黑";color:#6C6C6C;}
#main .m_reason .state{font-size: 48px;font-weight: bold;color:#9053F8;margin-top:10px;}
#main .m_reason .refresh{width: 120px;height: 40px;border-radius: 2px;background: #5660D5;text-align: center;line-height: 40px;margin-top:10px;}
#main .m_reason .refresh a{text-decoration: none;color: white;font-size: 20px;font-family: "微软雅黑";letter-spacing:4px;}
</style>
</head>
<body scroll=no>
	<div id="main">
		<div class="m_img">
			<img src="static/images/error.gif" alt="error" />
		</div>
		<div class="m_reason">
			<div>
				<p>出错了...</p>
				<p>禁止访问资源！</p>
			</div>
			<div class="state">405</div>
			<div class="refresh">
				<a href="javascript:history.go(-1)">刷新</a>
			</div>
		</div>
	</div>
</body>
</html>