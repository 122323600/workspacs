<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt"  uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="cm" uri="/WEB-INF/custom.tld"%>
<title>基础服务管理平台</title>
<meta name="keywords" content=""/>
<meta name="description" content=""/>
<link rel="icon" href="${pageContext.request.contextPath}/static/images/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="${pageContext.request.contextPath}/static/images/favicon.ico" type="image/x-icon" />
<link rel="apple-touch-icon" href="${pageContext.request.contextPath}/static/images/favicon.ico"/>
<!--<link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/reset.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/style.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/static/js/layui/css/layui.css"  media="all"/> -->
<script src="${pageContext.request.contextPath}/static/js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/static/js/layui/layui.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/js/jquery-validation/jquery.validate.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/static/js/jquery-validation/messages_zh.min.js"></script>
<meta name="viewport" content="width=device-width"/>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!-- 定义根目录简写 -->
<c:set var="ctx" value="${pageContext.request.contextPath}"/>