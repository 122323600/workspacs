<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<%@ include file="/common/common.jsp"%>
<script type="text/javascript" src="${ctx}/static/js/index.js"></script>
<style type="text/css">
html,body{width:100%;height:100%;margin:0;overflow:hidden}
</style>
<script type="text/javascript">
	$(function(){
		//自动高度
		setLeftHeight();
		setRightHeight();
		
		$(window).resize(function(){
		setLeftHeight();
		setRightHeight();
		});
		
		//初始化弹出层
		layerInit();
		//nav切换效果
		navSwitch();
		//左侧菜单切换效果
		//menuSwith();
		//菜单点击事件
		menuClick();
		//默认选中第一个
		selectFirstMenu();
		//任务图标切换效果
		taskIconSwitch();
	});
	
</script>
</head>
<body>
<!-- 错误信息 -->
<div id="error"></div>

<div id="head">
	<img src="${ctx}/static/images/logo.png"  alt="易联众logo" id="logo" />
	<div><img src="${ctx}/static/images/logoBack.png" height="60" alt="系统logo背景"/></div>
	<div class="controlPanel">控制台</div>
	<div class="appPanel">功能与应用</div>
	<div class="headRight">
		<span class="task"><img class="alarm alarmDark" src="${ctx}/static/images/alarm.png"/><img class="alarm alarmLight" src="${ctx}/static/images/alarmLight.png"/><img class="radius" src="${ctx}/static/images/radius.png"/><span class="alarmNum">2</span></span>
		<span class="userName">刘看山</span>
		<span class="headPortrait"><img src="${ctx}/static/images/headPortrait.png"/></span>
	</div>
</div>
<div class="clear"></div>

<div id="left">
	<div id="allMenu"><span class="allMenuText">全部分类</span><span class="allMenuImg"><img src="${ctx}/static/images/allMenu.png"/></span></div>
    <ul id="menuUl">
    	<li><span class="funId">0001</span><img class="darkIcon" src="${ctx}/static/images/setup.png"/><img class="lightIcon" src="${ctx}/static/images/setupLight.png"/>平台设置</li>
    	<li><span class="funId">0002</span><img class="darkIcon" src="${ctx}/static/images/app.png"/><img class="lightIcon" src="${ctx}/static/images/appLight.png"/>应用配置</li>
    	<li><span class="funId">0003</span><img class="darkIcon" src="${ctx}/static/images/user.png"/><img class="lightIcon" src="${ctx}/static/images/userLight.png"/>用户管理</li>
    	<li><span class="funId">0004</span><img class="darkIcon" src="${ctx}/static/images/role.png"/><img class="lightIcon" src="${ctx}/static/images/roleLight.png"/>角色管理</li>
    	<li><span class="funId">0005</span><img class="darkIcon" src="${ctx}/static/images/dept.png"/><img class="lightIcon" src="${ctx}/static/images/deptLight.png"/>单位管理</li>
    	<li><span class="funId">0006</span><img class="darkIcon" src="${ctx}/static/images/account.png"/><img class="lightIcon" src="${ctx}/static/images/accountLight.png"/>账号管理</li>
    	<li><span class="funId">0007</span><img class="darkIcon" src="${ctx}/static/images/message.png"/><img class="lightIcon" src="${ctx}/static/images/messageLight.png"/>消息中心</li>
    	<li><span class="funId">0008</span><img class="darkIcon" src="${ctx}/static/images/money.png"/><img class="lightIcon" src="${ctx}/static/images/moneyLight.png"/>费用中心</li>
    	<%-- <c:forEach var="fun" items="${funList.result}">
    	<li><span class="funId">${fun.funId}</span><img class="darkIcon" src="${ctx}/static/images/setup.png"/><img class="lightIcon" src="${ctx}/static/images/setupLight.png"/>${fun.funName}</li>
    	</c:forEach> --%>
    </ul>
    <div class="clear"></div>
</div>


<div id="right">
        <div id="content">
            <div id="nav">
            	<ul>
				   <%--  <li class="select"><span>url</span>平台管理</li>
				    <li><span>${ctx}/v1/system/list?pageNo=1&pageSize=10</span>应用管理</li>
				    <li><span>${ctx}/v1/dict/list?pageNo=1&pageSize=10</span>字典管理</li>
				    <li>安全管理</li>
				    <li><span>${ctx}/v1/org/list?pageNo=1&pageSize=10</span>组织管理</li> --%>
			  	</ul>
			</div>
			
			<iframe id="mainIframe" name="mainIframe" frameborder="0" src="${ctx}/business/main.jsp" scrolling="no" width="100%" height="500"></iframe>
			  	
	</div>	<!--content-->		  	
</div><!--right-->
</body>
</html>