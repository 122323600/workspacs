
//table 的奇数行自动变换颜色
function trColorChange(){
	$("table").find("tr").each(function(){
		var index = $(this).index();
		if(index%2==1){
			$(this).addClass("even");
		}
	});
	
}

//弹框公用方法 titile 弹出框的名称  url   宽度 高度  默认高度为null,只设宽度即可
function openDialog(title,url,width,height){
	parent.openDialog(title,url,width,height);
	//隐藏编辑里面的链接
	$(".edit").find("span").find("ul").hide();
}
	
	//表格中 编辑一列 点击
	function operSelectBtnClick(){
		$(".operBtn").click(function(){
			$(this).removeClass("").addClass();
		})
	}
	
	//点击操作按钮的效果
	function editBtnClick(){
		$(".operBtn").hover(function(){
			$(".edit").find(".operSelectBtn").each(function(){
				$(this).removeClass("operSelectBtn").addClass("operBtn");
			});
			$(this).removeClass("operBtn").addClass("operSelectBtn");
			
			$(".edit").find("span ul").each(function(){
				$(this).hide();
			});
			$(this).parent(".edit").find("span ul").fadeIn(100);
			
		})
	}
	
	//设置父页面高度 子页面通用方法 设置父页面的高度
	function setParentMainIframeHeight(){
		
		var mainHeight = $("#main").height();
		if(window.top==window.self){
		}else{
		top.setMainIframeHeight(mainHeight);
		}
	}
	
	//编辑的下拉按钮效果   鼠标移至空白处 隐藏 
	function hideEditDiv(){
		$(".edit").mouseleave(function(){
			//隐藏编辑里面的链接
		$(this).find("span").find("ul").fadeOut(100);
		});
	}
	
	function deleteBtnClick(url){
		//eg1       
		top.layer.confirm('您确定要删除当前记录吗？', {
			title:"警告",
		    btn: ['确定', '取消'], //可以无限个按钮
			skin: 'layui-layer_custom_confirm'
		}, function(index, layero){
		  window.location = url;
		}, function(index){
		  //按钮【按钮二】的回调
		});
	}
	
	//初始化搜索按钮事件
	function seachInit(){
		//高级搜索按钮
		$('.advanced_btn').on('click',function(){
			$('.advanced_div').width(($('.search').width())-1);
			$('.advanced_div').toggle();
		})
		
		//高级搜索取消按钮
		$('.cancel_btn').on('click',function(){
			$('.advanced_div').hide();
		})
	}
	
	//点击高级搜索div外部 隐藏高级搜索div
	document.onclick = function (event){     
		var e = event || window.event;  
		var elem = e.srcElement||e.target;  
		
		while(elem){   
			if(elem.className == "advanced_div" || elem.className == "advanced_btn"){  
				return;  
			}  
			elem = elem.parentNode;       
		}  
		//隐藏高级搜索div
		$('.advanced_div').hide();
	}
	
	parent.document.onclick = function (event){     
        var e = event || window.event;  
        var elem = e.srcElement||e.target;  
               
        while(elem){   
            if(elem.className == "advanced_div" || elem.className == "advanced_btn"){  
            	return;  
            }  
            elem = elem.parentNode;       
        }  
        //隐藏高级搜索div
        $('.advanced_div').hide();
    }
	
	function deleteBtnClickWithMsg(url,msg){
		//eg1       
		top.layer.confirm(msg, {
			title:"警告",
		    btn: ['确定', '取消'], //可以无限个按钮
			skin: 'layui-layer_custom_confirm'
		}, function(index, layero){
		  window.location = url;
		}, function(index){
		  //按钮【按钮二】的回调
		});
	}