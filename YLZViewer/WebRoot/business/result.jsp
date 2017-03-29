<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>基础服务管理平台</title>
<%@ include file="/common/common.jsp"%>
</head>
<body>
<script type="text/javascript">
if('${result.status}'=='0'){
	parent.iframeSwitch();
	parent.layer.alert('操作成功',{
	    skin: 'layui-layer_custom',
		title:'提示',
		closeBtn: 0,
		shift:2, //动画类型
		icon:6,
		offset: 'rb',
		shade: 0,
		time:4000
	  });
	var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
	parent.layer.close(index);
}else{
	parent.iframeSwitch();
	parent.layer.alert('${result.message},错误码：${result.status}',{
	    skin: 'layui-layer_custom',
		title:'错误',
		closeBtn: 0,
		shift:2, //动画类型
		icon:5,
		offset: 'rb',
		shade: 0,
		time:4000
	  });
	var index = parent.layer.getFrameIndex(window.name); //获取当前窗体索引
	parent.layer.close(index);
}


</script>
</body>
</html>