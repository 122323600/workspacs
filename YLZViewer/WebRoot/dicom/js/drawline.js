(function(){
	if(window.drawline) return false;
	//return array's max
        Array.prototype.max = function(){
            return Math.max.apply({}, this);
        }
		//return array's min
        Array.prototype.min = function(){
            return Math.min.apply({}, this);
        }
		var options={
			cssClickClass:'point',//点击时生成点的类
			svgCtnCls:'svgContainer',//svg容器的类
			wapper:'#maps',
			scale:'1'
		};
		var Ploy={
			getData:function(){
				var arrayTop=[];
				var arrayLeft=[];
				var el=options.wapper.find('div.'+options.cssClickClass);
				$.each(el,function(i,n){
					var pointTop=$(n).position().top;
					var pointLeft=$(n).position().left;
					arrayTop.push(pointTop);
					arrayLeft.push(pointLeft);
				});
				var minTop=arrayTop.min();
				var maxTop=arrayTop.max();
				var minLeft=arrayLeft.min();
				var maxLeft=arrayLeft.max();
				var svgWidth=maxLeft-minLeft+el.width();
				var svgHeight=maxTop-minTop+el.height();
				return {
					w:svgWidth,
					h:svgHeight,
					minTop:minTop,
					minLeft:minLeft,
					elWidth:el.width(),
					elHeight:el.height()
				}
			},
			makeSvgContainer:function(index){
				var s=this;
				var datas=s.getData();
				var div=$('#mapPloy'+index).is('div');
				if(!div){
					var svgContainer=$('<div/>')
								 .attr('id','mapPloy'+index)
								 .addClass(options.svgCtnCls)
								 .css({
									 position:'absolute',
								 	width:datas.w,
									height:datas.h,
									top:datas.minTop+datas.elHeight/2,
									left:datas.minLeft+datas.elWidth/2
					}).prependTo(options.wapper);
				}else{
					$('#mapPloy'+index).css({
						position:'absolute',
						width:datas.w,
						height:datas.h,
						top:datas.minTop+datas.elHeight/2,
						left:datas.minLeft+datas.elWidth/2
					})
				}
			},
			//添加点在地图区域中
			addPoint:function(top,left){
				var wapper=options.wapper;
				var t=wapper.offset().top;
				var l=wapper.offset().left;
				var pt=top-t;
				var pl=left-l;
				var point=$('<div/>').addClass(options.cssClickClass)
									 .css({
									 	top:pt,
										left:pl,
										poisiton:'absolute'
									 })
									 .appendTo(wapper);
			},
			makePoly:function(el,o,index){
				options.wapper=el;
				var s=this;
				s.addPoint(o.top,o.left);
				s.makeSvgContainer(index);
				//清空svg，重新画图
				el.find('div.'+options.svgCtnCls).empty();
				//遍历已经有的点，做出路线
				var points=el.find('div.'+options.cssClickClass);
				var datas=s.getData();
				//生成路径
				var path=""
				$.each(points,function(i,n){
					if(i==0){
						path+="M";
					}else{
						path+="L";
					}
					var leftInSvg=$(n).position().left-datas.minLeft;
					var TopInSvg=$(n).position().top-datas.minTop;
                    path += leftInSvg;
                    path += ",";
                    path += TopInSvg;
                    path += " ";
				});
				var ploy = Raphael('mapPloy'+index, datas.w, datas.h);
				var pathslength=ploy.path(path).attr({
					stroke:'#1791fc', 
					'stroke-width':3,
					opacity:.7, 
					fill:"none"});
				//计算距离
				return pathslength.getTotalLength()*options.scale;
			},
			//鼠标在地图区域中的坐标
			pointPosition:function(top,left){
				var wapper=options.wapper;
				var t=wapper.offset().top;
				var l=wapper.offset().left;
				var pt=top-t;
				var pl=left-l;
				var o={
						left:pl,
						top:pt
					}
				return o;
			},
			//鼠标移动是画线区域的数据
			getMoveData:function(pointPosition){
				var arrayTop=[];
				var arrayLeft=[];
				var el=options.wapper.find('div.'+options.cssClickClass).last();
					
					arrayTop.push(el.position().top);
					arrayTop.push(pointPosition.top);
					arrayLeft.push(el.position().left);
					arrayLeft.push(pointPosition.left);
				var minTop=arrayTop.min();
				var maxTop=arrayTop.max();
				var minLeft=arrayLeft.min();
				var maxLeft=arrayLeft.max();
				var svgWidth=maxLeft-minLeft+el.width();
				var svgHeight=maxTop-minTop+el.height();
				return {
					w:svgWidth,
					h:svgHeight,
					minTop:minTop,
					minLeft:minLeft,
					elWidth:el.width(),
					elHeight:el.height()
				}
			},
			//创建鼠标移动所用的画线区域div
			makeMoveSvgContainer:function(pointPosition){
				var s=this;
				var datas=s.getMoveData(pointPosition);
				var div=$('#movePloy').is('div');
				if(!div){
					var svgContainer=$('<div/>')
								 .attr('id','movePloy')
								 .addClass('moveContainer')
								 .css({
									position:'absolute',
								 	width:datas.w,
									height:datas.h,
									top:datas.minTop+datas.elHeight/2,
									left:datas.minLeft+datas.elWidth/2
					}).prependTo(options.wapper);
				}else{
					$('#movePloy').css({
						position:'absolute',
						width:datas.w,
						height:datas.h,
						top:datas.minTop+datas.elHeight/2,
						left:datas.minLeft+datas.elWidth/2
					})
				}
			},
			//鼠标移动画线
			makeLine:function(el,o){
				options.wapper=el;
				var s=this;
				//鼠标坐标
				var pointPosition=s.pointPosition(o.top,o.left);
				//删除鼠标移动时的专属画线区域,此时鼠标移动所画的路线也会删除
				$('.moveContainer').detach();
				//重新创建鼠标移动时的专属画线区域
				s.makeMoveSvgContainer(pointPosition);
				
				//找到最后一个点，做出新路线
				var lastPoint=el.find('div.'+options.cssClickClass).last();
				
				var datas=s.getMoveData(pointPosition);
				//生成路径
				var path="";
					path+="M";
					var leftInSvg=lastPoint.position().left-datas.minLeft;
					var TopInSvg=lastPoint.position().top-datas.minTop;
                    path += leftInSvg;
                    path += ",";
                    path += TopInSvg;
                    path += " ";
					
					path+="L";
					leftInSvg=pointPosition.left-datas.minLeft;
					TopInSvg=pointPosition.top-datas.minTop;
                    path += leftInSvg;
                    path += ",";
                    path += TopInSvg;
                    path += " ";
				//画线
				var ploy = Raphael('movePloy', datas.w, datas.h);
				var pathslength=ploy.path(path).attr({
					stroke:'#1791fc', 
					'stroke-width':3,
					opacity:.7, 
					fill:"none"});
				//计算距离
				return pathslength.getTotalLength()*options.scale;
			}
		}
	window.drawline={
		Ploy:Ploy
	}
})();