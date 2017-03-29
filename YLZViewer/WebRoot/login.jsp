<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<%@ include file="/common/common.jsp"%>
<script src="${ctx}/static/js/main.js"></script>
<script type="text/javascript">
	$(function(){
		//table 的奇数行变换颜色
		trColorChange();
		//点击操作按钮效果
		editBtnClick();
		//隐藏操作按钮弹出的div
		hideEditDiv();
		//设置父页面高度 子页面通用方法 设置父页面的高度 
		//注意：子页面 一定 要包在 id为main的div中
		setParentMainIframeHeight();
		//分页控件初始化
		pagingInit();
		//初始化搜索按钮事件
		seachInit();
		
		layui.use(['form'],function() {
			var form = layui.form(), layer = layui.layer;
			
			form.on('select(system)', function(data){
				var sysId=data.value;
				if(sysId.indexOf("请选择")>0){
					sysId="";
				}
				$("#sysId").val(sysId);
				});
			});
		
		var sysId="${param.sysId}";
		if(sysId!=null&&sysId!=''){
			$("#sysSelect").find("option[value="+sysId+"]").prop("selected",true);
		}
	});
	
	
	//分页栏
	function pagingInit(){
		
	layui.use(['laypage', 'layer'], function(){
  		var laypage = layui.laypage,
  		layer = layui.layer;
		
		laypage({
			curr:'${roleList.page.pageNo}',
		    cont: 'page',
		    pages: '${roleList.page.pages}',
		    groups: 5,
		    skin:'#5760d5',
		    first:1,
		    last:'${roleList.page.pages}',
		    skip:true,
		    jump: function(obj, first){
		      if(!first){
		   	 parent.iframeUrl = "${ctx}/role/list?pageSize=10&pageNo="+obj.curr;
	    	 parent.iframeSwitch();
		        layer.msg('第 '+ obj.curr +' 页');
		     }
	    }
  	  });
  	  
	});
	}
	
</script>
</head>
<body>
<div id="main">
	<div id="operDiv">
		<span class="addBtn" onclick="openDialog('添加角色','${ctx}/role/toAdd','800px')">添加角色</span>
			<form action="${ctx}/role/list" method="post" class="layui-form">
				<input type="hidden" name="pageSize" value="10"> <input
					type="hidden" name="pageNo" value="1"> <span class="search">
					<input type="text" value="${param.roleName }" name="roleName"
					class="search_key" placeholder="角色名称"><input type="submit"
					class="search_btn" value="搜索"> <input type="button"
					class="advanced_btn" value="高级">
					<div class="advanced_div">
						<div class="advanced_title">高级查询</div>
						<div class="advanced_content">
							状态:<input type="text" name="useFlag" id="useFlag"
								value="${param.useFlag}"></br>
							
						</div>
						<div class="advanced_bottom">
							<input type="submit" class="confirm_btn" value="确定"> <input
								type="button" class="cancel_btn" value="关闭">
						</div>
					</div>
				</span>
			</form>
		</div>
	<table>
		<tr>
		<th width="20%">角色名称</th>
		<th width="10%">状态</th>
		<th width="15%">创建日期</th>
		<th width="20%">创建人员</th>
		<th>备注</th>
		<th class="edit">编辑</th>
		</tr>
		
		<c:forEach var="role" items="${roleList.result}" >
		<tr>
		<td>${role.roleName}</td>
		<td><cm:value2name typeCode="ROLE_STATE" value="${role.useFlag}"  /></td>
		<td>${role.createDate}</td>
		<td>zzm</td>
		<td>${role.memo}</td>
		<td class="edit">
			<span class="operBtn">...
			<ul>
				<img class="point" src="${ctx}/static/images/triangle.png"/>
				<li><a href="javascript:openDialog('修改角色','${ctx}/role/toUpdate?roleId=${role.roleId}')">修改</a></li>
				<li class="impor"><a href="javascript:deleteBtnClick('${ctx}/role/delete?roleId=${role.roleId}')">删除</a></li>
			</ul>
			</span>
		</td>
		</tr>
		</c:forEach>
	</table>
	
	<div id="page">
		
	</div>
</div> <!--main-->
</body>
</html>