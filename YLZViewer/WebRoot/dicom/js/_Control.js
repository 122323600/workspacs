/**
 * Created by jmupanda on 2016/3/23.
 */
(function(){
    if(window.control) return;
	
	function Track(mouse, state, lastClickTime, mouseDownTime){
		var obj=new Object();
		obj.mouse=mouse?mouse:{x:0,y:0};//鼠标轨迹,一般记录按下时候的坐标
		obj.state=state?state:{};//初始状态,一般记录鼠标按下时图像的状态
		obj.lastClickTime=lastClickTime?lastClickTime:0;//上一次单击的时间,用来判断双击
		obj.mouseDownTime=mouseDownTime?mouseDownTime:0;//鼠标按下的时间,用来判断单击
		return obj;
	}
	//按钮事件模块
    var buttonControl=(function(){
        //存储所有会触发controlMode的按钮
        //避免轮询
        var controlModeButton='swapPage, move, windowing, scale, magnifier';
        //存储所有按钮的触发事件
        var buttonsMethod={
            //多窗
            windowMethod : function(){},
            //联动
            linkMethod : function(){},
            //点击
            swapPageMethod : function(){systemStatus.set('controlMode', 'swapPage');},
            //移动
            moveMethod : function(){systemStatus.set('controlMode', 'move');},
            //缩放
            scaleMethod : function(){systemStatus.set('controlMode', 'scale');},
            //放大镜
            magnifierMethod : function(){systemStatus.set('controlMode', 'magnifier');},
            //调窗
            windowingMethod : function(){systemStatus.set('controlMode', 'windowing');},
            //翻转
            turnMethod : function(){},
            //反色
            antiColorMethod : function(recentlyWindow){
                recentlyWindow.image.changeStatus({antiColor: ''});
                modal.windowModal.drawDicom(recentlyWindow);
            },
            //伪彩
            pseudoColorMethod : function(recentlyWindow){
                if(recentlyWindow.image.pixelBytes==3){
                    alert('彩图无法进行伪彩操作');
                    return;
                }
                recentlyWindow.image.changeStatus({pseudoColor: ''});
                modal.windowModal.drawDicom(recentlyWindow);
            },
            //四角信息
            infoShowMethod: function(){
                systemStatus.toggle('infoShow');
                view.windowView.showAllInfo(systemStatus.get('infoShow'));
            },
            //图像初始化
            cleanMethod: function(recentlyWindow){
                recentlyWindow.image.resetStatus();
                modal.windowModal.transformCanvas(recentlyWindow);
                modal.windowModal.drawDicom(recentlyWindow);
            },
            //测量选取
            selectMethod : function(recentlyWindow){
                systemStatus.set('controlMode', 'select');
                recentlyWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(recentlyWindow.id, 'measure', 'getImageData', {});
            },
            //测量绘制
            measureMethod: function(){
                systemStatus.set('controlMode', 'measure');
            },
            //箭头标注
            arrowNoteMethod: function(){
                systemStatus.set('controlMode', 'measure');
                systemStatus.set('measureDrawMode', 'arrowNote');
            },
            //文字标注
            textNoteMethod: function(){
                systemStatus.set('controlMode', 'measure');
                systemStatus.set('measureDrawMode', 'textNote');
            },
            //显示\隐藏测量
            viewMethod: function(){
                systemStatus.toggle('measureShow');
                view.windowView.showMeasure(systemStatus.get('measureShow'));
            },
            //清除测量
            cleanDrawMethod: function(recentlyWindow){
                var truthBeTold=window.confirm("确认清除当前画布的所有测量标注?");
                if(truthBeTold){
                    recentlyWindow.image.measureData.graphs=[];
                    view.windowView.getWindowCavMethod(recentlyWindow.id, 'measure', 'clean', {});
                    recentlyWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(recentlyWindow.id,'measure', 'getImageData', {});
                }
            },

            //以下为弹窗框按钮
            //多序列显示开关
            multipleSeriesButtonMethod: function(){
                view.buttonView.extendedBox.changeWindowButton('multipleSeries');
                systemStatus.toggle('multipleSeries');
/*				var len=0;
				$.each(modal.windowModal.windows, function(){
					if(this.display)len++;
				});
				if(len>1){
					var id=systemStatus.get('recentlyWindow').id;
					var r=parseInt(id.substring(id.indexOf("r")+1,id.indexOf("c")));
					var c=parseInt(id.substring(id.indexOf("c")+1));
					modal.windowModal.showWindows(r, c);
				}*/
            },
            //定位线开关
            positioningLineButtonMethod: function(recentlyWindow){
                view.buttonView.extendedBox.changeWindowButton('positioningLine');
                systemStatus.toggle('positioningLine');
                //此处写入清理或显示定位线的逻辑
                if(systemStatus.get('positioningLine')){
                    modal.windowModal.findWindowToDrawPL(recentlyWindow);
                }else{
                    view.windowView.cleanAllCav('positioningLine');
                }
            },
            //序列同步开关
            seriesSynchronousButtonMethod: function(){
                view.buttonView.extendedBox.changeWindowButton('seriesSynchronous');
                systemStatus.toggle('seriesSynchronous');
            },
            //病灶定位同步开关
            lesionsPointButtonMethod: function(){
                view.buttonView.extendedBox.changeWindowButton('lesionsPoint');
                systemStatus.toggle('lesionsPoint');
                //此处写入清理或显示病灶的逻辑
                if(!systemStatus.get('lesionsPoint')){
                    view.windowView.cleanAllCav('lesionsPoint');
                }
            },
            //序列联动
            orderLinkMethod: function(){
                view.buttonView.getButtonMethod('link', 'replace', {name: 'orderLink'});
                systemStatus.set('link', 1);
            },
            //全联动
            allLinkMethod: function(){
                view.buttonView.getButtonMethod('link', 'replace', {name: 'allLink'});
                systemStatus.set('link', 2);
            },
            //无联动
            noneLinkMethod: function(){
                view.buttonView.getButtonMethod('link', 'replace', {name: 'noneLink'});
                systemStatus.set('link', 0);
            },
            //强制调窗同步
            manSyncWindowsMethod: function(){
                var sign=systemStatus.get('manSyncWindows');
                if(sign){
                    $('.manSyncWindows').removeClass('active');
                }else{
                    $('.manSyncWindows').addClass('active');
                }
                systemStatus.set('manSyncWindows',!sign);
            },
            //翻滚还原
            recoverMethod: function(recentlyWindow){
                recentlyWindow.image.changeStatus({
                    horizontal : 1,
                    vertical : 1,
                    rotate :0
                });
                modal.windowModal.transformCanvas(recentlyWindow);
            },
            //倒置翻转
            verticalMethod: function(recentlyWindow){
                recentlyWindow.image.changeStatus({vertical : -recentlyWindow.image.state.vertical});
                modal.windowModal.transformCanvas(recentlyWindow);
            },
            //镜像翻转
            horizonMethod: function(recentlyWindow){
                recentlyWindow.image.changeStatus({horizontal : -recentlyWindow.image.state.horizontal});
                modal.windowModal.transformCanvas(recentlyWindow);
            },
            //左90翻转
            left90Method: function(recentlyWindow){
                recentlyWindow.image.changeStatus({rotate : recentlyWindow.image.state.rotate - 90});
                modal.windowModal.transformCanvas(recentlyWindow);
            },
            //右90翻转
            right90Method: function(recentlyWindow){
                recentlyWindow.image.changeStatus({rotate : recentlyWindow.image.state.rotate+90});
                modal.windowModal.transformCanvas(recentlyWindow);
            },
            //原大小
            originalMethod: function(recentlyWindow){
                recentlyWindow.image.changeStatus({scale : 1 / recentlyWindow.baseState.scale});
                modal.windowModal.transformCanvas(recentlyWindow);
            },
            //预设窗
            windowLiMethod: function(recentlyWindow, value){
                if(recentlyWindow.image.pixelBytes===3){
                    alert('彩图无法进行窗宽高的设置');
                    return;
                }
                if(value=="defaults" || value==='full'){
                    recentlyWindow.image.changeStatus({windowWidth : value});
                }else{
                    recentlyWindow.image.changeStatus({
                        windowWidth : parseInt(value.match( /[0-9]+(?=c)/g)),
                        windowCenter : parseInt(value.match( /[0-9]+$/g))
                    });
                }
                modal.windowModal.drawDicom(recentlyWindow);
            },
            //自设窗
            windowSetButtonMethod: function(recentlyWindow){
                if(recentlyWindow.image.pixelBytes===3){
                    alert('彩图无法进行窗宽高的设置');
                    return;
                }
                var text=prompt("分别输入窗宽,窗位(用空格隔开)", "");
                if(text != null && text != ""){
                    var w=parseInt(text.match(/[0-9]+(?= +)/g)),
                        c=parseInt(text.match(/[0-9]+$/g));
                    if(w !== null &&c !== null){
                        recentlyWindow.image.changeStatus({
                            windowWidth : parseInt(w),
                            windowCenter : parseInt(c)
                        });
                        modal.windowModal.drawDicom(recentlyWindow);
                    }else{
                        alert("格式错误");
                    }
                }
            },
            //点测量
            ctMeasureMethod: function(){
                view.buttonView.getButtonMethod('measure', 'replace', {name: 'ctMeasure'});
                systemStatus.set('measureDrawMode', 'ct');
            },
            //直线测量
            lineMeasureMethod: function(){
                view.buttonView.getButtonMethod('measure', 'replace', {name: 'lineMeasure'});
                systemStatus.set('measureDrawMode', 'line');
            },
            //角度测量
            angleMeasureMethod: function(){
                view.buttonView.getButtonMethod('measure', 'replace', {name: 'angleMeasure'});
                systemStatus.set('measureDrawMode', 'angle');
            },
            //矩形测量
            squareMeasureMethod: function(){
                view.buttonView.getButtonMethod('measure', 'replace', {name: 'squareMeasure'});
                systemStatus.set('measureDrawMode', 'square');
            },
            //椭圆测量
            circleMeasureMethod: function(){
                view.buttonView.getButtonMethod('measure', 'replace', {name: 'circleMeasure'});
                systemStatus.set('measureDrawMode', 'circle');
            }
        };

        //私有方法
        //按钮事件分配
        function fireEventFromButton(button){
            //获取按钮的名称,并存储
            var name=$(button).attr("name");
            //按钮视图活动
            view.buttonView.buttonActive(name);
            //存储信息
            systemStatus.set('recentlyButton', name);
            //调用
            var recentlyWindow=systemStatus.get('recentlyWindow');
            buttonsMethod[name+'Method'] && buttonsMethod[name+'Method'](recentlyWindow);
        }
        //弹出框按钮分配时间
        function fireEventFormExtendedButton(button){
            //获取按钮名称
            var name=$(button).attr('name'),
                value=$(button).attr('value');
            //关闭弹出框
            //view.buttonView.extendedBox.show(false);
            //调用
            var recentlyWindow=systemStatus.get('recentlyWindow');
            buttonsMethod[name+'Method'] && buttonsMethod[name+'Method'](recentlyWindow, value);
        }

        //接口
        return {
            init: function(){
                // 按钮绑定
                $(".boardFunction-part").on("click", ".boardFunction-button", function(){
                    fireEventFromButton(this);
                });
                //弹出框按钮绑定
                $("#extendedBox").on("click", "button, li", function(){
                    fireEventFormExtendedButton(this);
                });
                //模拟a标签点击,使其展开面板
                $(".part-title").click(function(){
                    if(systemStatus.get('boardFunctionCollapseSign')){
                        $(".part-body").collapse('hide');
                    }
                    $(this).parent().children(".part-body").collapse('toggle');
                });
                $(".part-body").on("show.bs.collapse", function(){
                    $(this).parent().find(".part-title-icon").css({
                        transform: "rotate(0deg)",
                        right: "10px"
                    });
                }).on("hide.bs.collapse", function(){
                    $(this).parent().find(".part-title-icon").css({
                        transform: "rotate(180deg)",
                        right: "13px"
                    });
                });
            }
        }
    })();
    //鼠标事件模块
    var mouseControl=(function(){
        //鼠标移动轨迹
        var track=new Track();
        //图像绘制中的标志
        var graph_drawing=null;
        var movingSign={
            found: false,//鼠标是否悬停在一个图形上面
            select: false,//是否选中
            content:{
                type: '',//point/graph选中的是一个图形还是一个点
                graph: null,//如果type是图形,则graph有值
                point: null//如果type是点,则point有值
            }
        };
        //涉及鼠标的
        var mouseMethod={
            //点击
            swapPage: function(dicomWindow, eventName, mouse){
                if(eventName==='mousemove_press'){
//                    var i=10;//翻页灵敏度
//                    if(mouse.y - track.mouse.y>i){
//                        modal.windowModal.show(dicomWindow, 'switchPage', {
//                            sign: true
//                        });
//                        track.mouse=mouse;
//                    }else if(mouse.y - track.mouse.y < -i){
//                        modal.windowModal.show(dicomWindow, 'switchPage', {
//                            sign: false
//                        });
//                        track.mouse=mouse;
//                    }					
                }else if(eventName==='mousedown'){
                    //track.mouse=mouse;
/*                    if(systemStatus.get('lesionsPoint')){
                        modal.windowModal.drawLesionsPoint(getMouseXYofCanvas(mouse.x, mouse.y), dicomWindow);
                    }*/
                }else if(eventName==='doubleClick'){
                    modal.windowModal.windowZoom(dicomWindow);
                }
				return false;
            },
            //移动
            move: function(dicomWindow, eventName, mouse){
                if(eventName==='mousemove_press'){
                    dicomWindow.image.changeStatus({
                        posX : track.state.posX+mouse.x - track.mouse.x,
                        posY : track.state.posY+mouse.y - track.mouse.y
                    });
                    modal.windowModal.transformCanvas(dicomWindow);
                }else if(eventName=="mousedown"){
                    track.mouse=mouse;
                    track.state={
                        posX: dicomWindow.image.state.posX,
                        posY: dicomWindow.image.state.posY
                    }
                }
            },
            //调窗
            windowing: function(dicomWindow, eventName, mouse){                
/*				if(dicomWindow.image==null&&dicomWindow.id==="panelCanvasOutside"){
					dicomWindow.image=systemStatus.get('zoomWindow').image;
				}*/
				var image=dicomWindow.image;
				switch(eventName){
					case 'mousedown':{
						track.mouse=mouse;
						track.state={
							windowWidth : image.state.windowWidth,
							windowCenter: image.state.windowCenter
						};
						break;
					}
					case 'mouseup':{
						image.changeStatus({
							//窗宽位的调整还涉及到整个窗口的大小,鼠标从窗口的一边滑倒另一边,数值的改变幅度为maxGray;
							windowWidth: track.state.windowWidth+Math.round(( mouse.x - track.mouse.x)* image.maxGray / window.innerWidth),
							windowCenter: track.state.windowCenter+Math.round(( mouse.y - track.mouse.y)* image.maxGray / 2 / window.innerHeight)
						});
						modal.windowModal.drawDicom(dicomWindow);
						break;
					}
				}
                /*if(eventName=="mousemove_press"){
                    image.changeStatus(image.pixelBytes==3 ? {
                        brightness: track.state.brightness+(mouse.x - track.mouse.x) / 5,
                        contrast: track.state.contrast+mouse.y - track.mouse.y
                    } : {
                        //窗宽位的调整还涉及到整个窗口的大小,鼠标从窗口的一边滑倒另一边,数值的改变幅度为maxGray;
                        windowWidth: track.state.windowWidth+Math.round(( mouse.x - track.mouse.x)* image.maxGray / window.innerWidth),
                        windowCenter: track.state.windowCenter+Math.round(( mouse.y - track.mouse.y)* image.maxGray / 2 / window.innerHeight)
                    });
                    modal.windowModal.drawDicom(dicomWindow);
                }else if(eventName=="mousedown"){
                    track.mouse=mouse;
                    track.state=image.pixelBytes==3 ? {
                        brightness : image.state.brightness,
                        contrast: image.state.contrast
                    } : {
                        windowWidth : image.state.windowWidth,
                        windowCenter: image.state.windowCenter
                    };
                }*/
            },
            //缩放
            scale: function(dicomWindow, eventName, mouse){
                if(eventName=="mousemove_press"){
                    dicomWindow.image.changeStatus({
                        scale : track.state.scale+(mouse.y - track.mouse.y) * 0.01
                    });
                    modal.windowModal.transformCanvas(dicomWindow);
                }else if(eventName=="mousedown"){
                    track.mouse=mouse;
                    track.state={
                        scale : dicomWindow.image.state.scale
                    }
                }
            },
            //放大镜
            magnifier: function(dicomWindow, eventName, mouse){
                //坐标转换
                mouse=getMouseXYofCanvas(mouse.x, mouse.y);
                if(eventName=="mousedown"){
                    view.windowView.magnifier.create(dicomWindow.id);
                    view.windowView.magnifier.move(mouse.x, mouse.y);
                    view.windowView.magnifier.draw(getMagnifierData(dicomWindow, mouse));
                }else if(eventName=="mousemove_press"){
                    view.windowView.magnifier.move(mouse.x, mouse.y);
                    view.windowView.magnifier.draw(getMagnifierData(dicomWindow, mouse));
                }else if(eventName=="mouseup"){
                    view.windowView.magnifier.delete();
                }
            },
            //测量
            measure: function(dicomWindow, eventName, mouse){
                //坐标转换
                mouse=getMouseXYofCanvas(mouse.x, mouse.y);
                var mode=systemStatus.get('measureDrawMode');
                //不同事件拥有不同处理
                switch (eventName){
                    //视图measure的set方法用来刷新界面,getImageData则是保存当前界面
                    case 'mousemove_noPress':
                        measureMethod[mode] && measureMethod[mode](dicomWindow, eventName, mouse);
                        break;
                    case 'mousemove_press' :
                        view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
                        measureMethod[mode] && measureMethod[mode](dicomWindow, eventName, mouse);
                        break;
                    case 'mousedown' :
                        track.mouse=mouse;
                        //ct不需要存储,而angle由于需要两次点击才能完成绘制,所以也属于特殊情况
                        if(mode !== 'ct' && mode !== 'angle'){
                            dicomWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'getImageData', {});
                            graph_drawing=dicomWindow.image.addGraph({
                                dicomWindow: dicomWindow,
                                type: mode,
                                data: {
                                    point:[mouse]
                                }
                            });
                        }
                        measureMethod[mode] && measureMethod[mode](dicomWindow, eventName, mouse);
                        break;
                    case 'mouseup' :
                        if(systemStatus.get('isClick')){
                            systemStatus.set('isClick', false);
                        }else{
                            view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
                            graph_drawing && graph_drawing.getArea();
                            measureMethod[mode] && measureMethod[mode](dicomWindow, eventName, mouse);
                            //ct的绘制不需要保存canvas的状态,而angle由于需要两次点击才能完成绘制,所以也进行特殊处理
                            if(mode !== 'ct' && mode !== 'angle'){
                                graph_drawing=null;
                                dicomWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'getImageData', {});
                            }
                        }
                        break;
                    case 'click' :
                        //click事件会比mouseup先触发,如果操作是一个click并且鼠标移动的长度不超过屏幕10个像素,则取消接下来的mouseup动作
                        if(measureTool.countLength(track.mouse, mouse) < 10){
                            systemStatus.set('isClick', true);
                            view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
                            measureMethod[mode] && measureMethod[mode](dicomWindow, eventName, mouse);

                            //删除正在操作的graph,除了文字标识
                            if(graph_drawing){
                                graph_drawing.delete();
                                graph_drawing=null;
                            }
                        }
                        break;
                    default :break;
                }
            },
            //选择
            select: function(dicomWindow, eventName, mouse){
                var i, j , l , m,
                    graphs=dicomWindow.image.measureData.graphs;
                mouse=getMouseXYofCanvas(mouse.x, mouse.y);
                switch (eventName){
                    //寻找图形
                    case 'mousemove_noPress':
                        for (i=0,l=graphs.length; i < l; i += 1){
                            if(graphs[i].found(mouse)){
                                movingSign.found=true;
                                break;
                            }
                        }
                        if(i==l){
                            movingSign.found=false;
                        }
                        break;
                    //修改图形
                    case 'mousemove_press':
                        if(movingSign.select && movingSign.found){
                            movingSomething(dicomWindow, mouse);
                        }
                        break;
                    //确定图形
                    case 'mousedown':
                        dicomWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'getImageData', {});
                        track.mouse=mouse;
                        for (i=0,l=graphs.length; i < l; i += 1){
                            movingSign.content=graphs[i].found(mouse);
                            if(movingSign.content){
                                movingSign.select=true;
                                movingSign.found=true;
                                break;
                            }
                        }
                        if(i==l){
                            movingSign.found=false;
                            movingSign.select=false;
                        }
                        break;
                    //确定修改图像
                    case 'mouseup':
                        if(movingSign.select && movingSign.found){
                            movingSign.content.graph.getArea();
                            movingSomething(dicomWindow, mouse);
                            dicomWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'getImageData', {});
                        }
                        break;
                    //文字标识的修改需要点击触发
                    case 'click' :
                        if(movingSign.select && movingSign.found && movingSign.content.graph.type==='textNote'){
                            if(measureTool.countLength(track.mouse, mouse) < 10){
                                var g=movingSign.content.graph;
                                var text=prompt("请输入修改文本", "");
                                if(text != null && text != ""){
                                    g.data.text=text;
                                    dicomWindow.image.refreshGraphs(dicomWindow);
                                }
                            }
                        }
                        break;
                    default :

                }
            }
        };
        //测量各类图形的绘制
        var measureMethod={
            ct: function(dicomWindow, eventName, mouse){
                if(eventName=='mousemove_press' || eventName=='mousedown'){
                    eventName=='mousedown' && view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {
                        imageData: dicomWindow.image.measureData.imageData
                    });
                    var image=dicomWindow.image,
                        pixelData=image.pixelData;
                    var point=measureTool.coordinateChange(dicomWindow, mouse, 'save');
                    //将坐标原点转换至左上角
                    point={
                        x: Math.round(point.x+image.columns / 2),
                        y: Math.round(point.y+image.rows / 2)
                    };
                    var loc=[//取一个区域的平均值
                        point.x - 1+(point.y - 1) * image.columns, point.x+(point.y - 1) * image.columns, point.x+1+(point.y - 1) * image.columns,
                        point.x - 1+point.y * image.columns, point.x+point.y * image.columns, point.x+1+point.y * image.columns,
                        point.x - 1+ (point.y+1) * image.columns, point.x+(point.y+1) * image.columns, point.x+(point.y+1) * image.columns
                    ];
                    if(point.x < 0 || point.y < 0 || point.x>image.columns){//不在图像范围内,则不显示
                    }else{
                        var data=0;
                        if(image.modality.match(new RegExp('(ct|mr)', 'i'))){
                            for (var i=0; i < 9; i += 1){
                                data += typeof(pixelData[loc[i]]) !== 'undefined' ? pixelData[loc[i]] :0;
                            }
                            data=Math.round(data / 9);
                        }
                        view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'CTPoint', {
                            text : {
                                modality: dicomWindow.image.modality,
                                number: data,
                                x: point.x,
                                y: point.y
                            },
                            position: mouse
                        });
                    }
                }else if(eventName=='mouseup'){
                    view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
                }
            },
            line: function(dicomWindow, eventName, mouse){
                if(graph_drawing){
                    if(eventName=='mousemove_press' || eventName=='mouseup'){
                        graph_drawing.changePoint(2, mouse, dicomWindow);
                        graph_drawing.draw(dicomWindow);
                    }
                }
            },
            square: function(dicomWindow, eventName, mouse){
                if(graph_drawing){
                    if(eventName=='mousemove_press' || eventName=='mouseup'){
                        graph_drawing.changePoint(2, mouse, dicomWindow);
                        graph_drawing.draw(dicomWindow);
                    }
                }
            },
            circle: function(dicomWindow, eventName, mouse){
                if(eventName=='mousemove_press' || eventName=='mouseup'){
                    if(graph_drawing){
                        graph_drawing.changePoint(2, mouse, dicomWindow);
                        graph_drawing.draw(dicomWindow);
                    }
                }
            },
            angle: function(dicomWindow, eventName, mouse){
                //角度绘制有较为复杂的步骤
                //1.第一次按下,生成graph,并设置开始绘制的标志angleFinishSign为1
                //2.按下移动,会进行角度第一条线的绘制
                //3.弹起,进行角度第一条线的绘制,并使sign为2
                //4.无按下移动,进行角度第二条线的绘制
                //5.第二次按下,绘制,保存绘制状态,结束.
                var sign=systemStatus.get('angleFinishSign');
                if(eventName=="mousemove_press" && sign==1){
                    if(graph_drawing){
                        graph_drawing.changePoint(2, mouse, dicomWindow);
                        graph_drawing.draw(dicomWindow);
                    }
                }else if(eventName=="mousemove_noPress" && sign==2){
                    view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
                    if(graph_drawing){
                        graph_drawing.changePoint(3, mouse, dicomWindow);
                        graph_drawing.draw(dicomWindow);
                    }
                }else if(eventName=="mousedown"){
                    if(sign){
                        //向dicomWindow.image添加内容
                        view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
                        if(graph_drawing){
                            graph_drawing.changePoint(3, mouse, dicomWindow);
                            graph_drawing.draw(dicomWindow);
                        }
                        //保存一下imageDate数据.防止click对画布的刷新
                        dicomWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'getImageData', {});
                        //删除掉该标志
                        graph_drawing=null;
                        systemStatus.delete('angleFinishSign');
                    }else{
                        systemStatus.set('angleFinishSign', 1);
                        graph_drawing=dicomWindow.image.addGraph({
                            dicomWindow: dicomWindow,
                            type: 'angle',
                            data: {
                                point:[mouse]
                            }
                        });
                    }
                }else if(eventName=="mouseup"){
                    if(sign==1){
                        if(graph_drawing){
                            graph_drawing.changePoint(2, mouse, dicomWindow);
                            graph_drawing.draw(dicomWindow);
                        }
                        systemStatus.set('angleFinishSign', 2);
                    }
                }else if(eventName=='click'){
                    systemStatus.delete('angleFinishSign');
                }
            },
            arrowNote: function(dicomWindow, eventName, mouse){
                if(graph_drawing){
                    if(eventName=='mousemove_press' || eventName=='mouseup'){
                        graph_drawing.changePoint(2, mouse, dicomWindow);
                        graph_drawing.draw(dicomWindow);
                    }
                }
            },
            textNote: function(dicomWindow, eventName, mouse){
                if(eventName=="mousedown"){
                    var text=prompt("请输入文本", "");
                    if(text != null && text != ""){
                        graph_drawing.data.text=text;
                        graph_drawing.draw(dicomWindow);
                        dicomWindow.image.measureData.imageData=view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'getImageData', {});
                        graph_drawing=null;
                    }else{
                        graph_drawing.delete();
                    }
                }
            }
        };

        //事件规划
        function processMouseEvent(e){
            var controlledEle='',
                mouse={
                    x: e.pageX,//相对于页面的位置
                    y: e.pageY
                },
                eventType='',
                time=Date.now();
            switch (e.type){
                case 'mousemove':
                    eventType=track.touchDown ? 'mousemove_press' : 'mousemove_noPress';
                    break;
                case 'mousedown':
                    controlledEle=e.currentTarget.getAttribute('id');
                    track.touchDown=e.which;
                    track.mouseDownTime=time;
                    eventType='mousedown';
                    break;
                case 'mouseup':
                    track.touchDown=0;
                    var click=time - track.mouseDownTime;
                    if(click <= 300){//较宽的单击间隔
                        if(track.lastClickTime){
                            fireMouseEvent('click', {controlledEle: controlledEle, mouse: mouse});
                            if( time - track.lastClickTime < 300 && measureTool.pointInTheArea(track.lastClickPosition, mouse, 5)){
                                fireMouseEvent('doubleClick', {controlledEle: controlledEle,mouse: mouse});
                            }
                        }
                        track.lastClickPosition=mouse;
                        track.lastClickTime=time;
                    }
                    eventType='mouseup';
                    break;
                case 'mouseleave':
                    eventType=track.touchDown ? 'mouseup' : '';
                    track.touchDown=0;
                    break;
                default :
                    return false;
            }
            //五种操作模式,分别为
            //mousedown, mousemove_press, mousemove_noPress, mouseup, click, doubleClick
            eventType !== '' && fireMouseEvent(eventType, {controlledEle: controlledEle,mouse: mouse});
        }
        //分配
        function fireMouseEvent (eventType, data){
            //获取最近操作的窗口
            var recentlyWindow=systemStatus.get('recentlyWindow'),
                controlMode=systemStatus.get('controlMode');
            switch (eventType){
                case 'click':
                    if(controlMode=='measure' || controlMode=='select'){
                        mouseMethod[controlMode] && mouseMethod[controlMode](recentlyWindow, eventType, data.mouse);
                    }
                    break;
                case 'doubleClick':
                    if(controlMode=='swapPage'){
                        mouseMethod[controlMode] && mouseMethod[controlMode](recentlyWindow, eventType, data.mouse);
                    }
                    break;
                case 'mousemove_noPress':
                    if(controlMode=='measure' && systemStatus.get('measureDrawMode')=='angle' || controlMode=='select'){
                        mouseMethod[controlMode] && mouseMethod[controlMode](recentlyWindow, eventType, data.mouse);
                    }
                    break;
                case 'mousedown':
                    if(data.controlledEle.indexOf('panelCanvas') >= 0 && data.controlledEle !== recentlyWindow.id){
                        //修改最近操作的窗口
                        recentlyWindow=modal.windowModal.selectWindow(data.controlledEle);

                    }
                default :
                    if(track.touchDown===3){//如果是右键,则调窗
                        controlMode='windowing';
                    }
                    mouseMethod[controlMode] && mouseMethod[controlMode](recentlyWindow, eventType, data.mouse);
            }
        }

        //获取放大镜所需的数据
        function getMagnifierData (dicomWindow, mouse){
            var magnifierStyle=view.windowView.magnifier.getStyle(),
                _cav=view.windowView.getWindowAttr(dicomWindow.id, '_cav'),
                _window=view.windowView.getWindowAttr(dicomWindow.id, '_window'),
                state=dicomWindow.image.state,
                scale=state.scale * dicomWindow.baseState.scale,
                offset=_window.offset(),//获取大面板的在视界的坐标
                offset2=_cav.offset(),//获取dicom画布在视界的坐标
                x=offset2.left - offset.left,//两者相减,获得dicom画布相对于大面板的坐标;
                y=offset2.top - offset.top,
                width=magnifierStyle.width / magnifierStyle.scale / scale,
                height=magnifierStyle.height / magnifierStyle.scale / scale,
                pos_x=(mouse.x - x) / scale - width / 2,
                pos_y=(mouse.y - y) / scale - height / 2;//宽高及位置随着画布放缩比例而修改.
            if(state.rotate){
                if(state.rotate==90){
                    pos_x=(mouse.y - y) / scale - height / 2;
                    pos_y=_cav.height() - (mouse.x - x) / scale - width / 2;
                }else if(state.rotate==270){
                    pos_x=_cav.width() - (mouse.y - y) / scale - height / 2;
                    pos_y=(mouse.x - x) / scale - width / 2;
                }else if(state.rotate==180){
                    pos_x=_cav.width() - (mouse.x - x) / scale - width / 2;
                    pos_y=_cav.height() - (mouse.y - y) / scale - height / 2;
                }
            }
            if(state.horizontal==-1)
                pos_x=_cav.width() - pos_x - height;
            if(state.vertical==-1)
                pos_y=_cav.height() - pos_y - width;
            return {
                cav: _cav.get(0),
                rotate: state.rotate,
                horizontal: state.horizontal,
                vertical: state.vertical,
                posX: Math.round(pos_x),
                posY: Math.round(pos_y),
                width: Math.round(width),
                height: Math.round(height)
            };
        }

        //获取鼠标相对于某窗的位置
        function getMouseXYofCanvas (x, y){
            var offset=$("#"+systemStatus.get('recentlyWindow').id).offset();
            return {
                x: Math.floor((x - offset.left)),
                y: Math.floor((y - offset.top))
            };
        }

        //移动形状
        function movingSomething (dicomWindow, mouse){
            view.windowView.getWindowCavMethod(dicomWindow.id, 'measure', 'set', {imageData: dicomWindow.image.measureData.imageData});
            var graph=movingSign.content.graph;
            if(movingSign.content.type==="point"){
                var loc=measureTool.coordinateChange(dicomWindow, mouse, "save");
                if(graph.type=="square" ||graph.type=="circle"){
                    switch (movingSign.content.no){
                        case 0 ://上
                            graph.data.point[0].y=loc.y;
                            break;
                        case 1 ://下
                            graph.data.point[1].y=loc.y;
                            break;
                        case 2 ://左
                            graph.data.point[0].x=loc.x;
                            break;
                        case 3 ://右
                            graph.data.point[1].x=loc.x;
                            break;
                        default :
                    }
                }else{
                    graph.data.point[movingSign.content.no].x=loc.x;
                    graph.data.point[movingSign.content.no].y=loc.y;
                }
            }else if(movingSign.content.type==="graph"){
                var move_x=mouse.x - track.mouse.x,
                    move_y=mouse.y - track.mouse.y;
                track.mouse=mouse;
                for (var j=0; j < graph.data.point.length; j += 1){
                    var point1=measureTool.coordinateChange(dicomWindow, graph.data.point[j], "draw");
                    var point2={
                        x: point1.x+move_x,
                        y: point1.y+move_y
                    };
                    point2=measureTool.coordinateChange(dicomWindow, point2, "save");
                    graph.data.point[j]=point2;
                }
            }
            dicomWindow.image.refreshGraphs(dicomWindow);
        }
        //接口
        return {
            init: function(){
                //鼠标操作事件
                $(".boardImage").on('mousedown', '.panelCanvas,#panelCanvasOutside', function(e){
                    processMouseEvent(e);
                }).on('mousemove mouseup mouseleave', function(e){
                    processMouseEvent(e);
                });
                //多窗选择
                $("#extendedBox").on("mouseover", ".windowNum_div", function(){
                    var id=$(this).attr("id"),
                        r=parseInt(id.substring(id.indexOf("r")+1, id.indexOf("c"))),
                        c=parseInt(id.substring(id.indexOf("c")+1));
                    view.buttonView.extendedBox.lightWindowNumDiv(r, c);
                }).on("click", ".windowNum_div", function(e){
                    var id=$(this).attr("id"),
                        r=parseInt(id.substring(id.indexOf("r")+1, id.indexOf("c"))),
                        c=parseInt(id.substring(id.indexOf("c")+1));
                    modal.windowModal.showWindows(r, c);
                    //关闭弹出框
                    view.buttonView.extendedBox.show(false);
                }).on("mouseleave",function(){
					var w=null;
					$.each(modal.windowModal.windows,function(i,v){
						if(this.display)w=this;
					});
					var id=w.id;
					var r=parseInt(id.substring(id.indexOf("r")+1,id.indexOf("c")))+1;
					var c=parseInt(id.substring(id.indexOf("c")+1))+1;
                    view.buttonView.extendedBox.lightWindowNumDiv(r, c);
                });
            },
            movingSign: movingSign
        }
    })();
    //其他事件模块
    var otherControl=(function(){
        //自加载定时器
        var loadTimer=null;
        //函数节流用定时器
        var timer2=null;
		var track=new Track();
        return {
            init: function(){
                //body
                // 用于使下拉列表点击外围消失
                var _body=$('body');
                _body.click(function(e){
                    if(systemStatus.get('isOut')&&$(e.target).parents('#extendedBox').length==0){
                        view.buttonView.extendedBox.show(false);
                    }
                    systemStatus.set('isOut', true);
                });

                //键盘事件
                _body.on("keyup", function(e){
                    if(e.keyCode==46){//46为DEL的键盘码
                        if(mouseControl.movingSign.select && mouseControl.movingSign.content.graph){
                            mouseControl.movingSign.content.graph.delete();
                            var recentlyWindow=systemStatus.get('recentlyWindow'),
                                image=recentlyWindow.image;
                            image.refreshGraphs(recentlyWindow);
                            image.measureData.imageData=view.windowView.getWindowCavMethod(recentlyWindow.id, 'measure', 'getImageData', {});
                        }
                    }else if(e.keyCode==27){//27为ESC的键盘码
                        if(!$(".panelCanvasOutside").is(":hidden")){
                           modal.windowModal.windowZoom(systemStatus.get('recentlyWindow'));
                        }
                    }
                });

                //序列点击
                $(".order-info").on("click", ".order-info-part", function(){//hehe
                    var id=this.getAttribute("id");
                    id=parseInt(id.substr(16));
                    var recentlyWindow=systemStatus.get('recentlyWindow');
                    if(systemStatus.get('singleSeriesSign')){
                         modal.windowModal.show(recentlyWindow, 'orderClick', {
                             seriesNo:0,
                             imageNo: id
                         });
                    }else{
                        modal.windowModal.show(recentlyWindow, 'orderClick', {
                            seriesNo:id,
                            imageNo:0
                        });
                    }
                    view.seriesView.seriesLight(id);
                });

                //浏览器的大小发生变化
                $(window).resize(function(){
                    if(timer2){
                        clearTimeout(timer2);
                    }
                    timer2=setTimeout(function(){
                        view.initSize();
                        modal.windowModal.showWindows();
                    }, 500);

                });

                //鼠标滚轮事件
                var _boardImage=$(".boardImage"),
                    _panelOutside= $(".panelCanvasOutside");
                _boardImage.get(0).onmousewheel=function(e){
					var imageContainer=systemStatus.get('recentlyWindow');
					var img=$("#"+imageContainer.id).find('img').get(0);
					if(img.naturalWidth>0){
						modal.windowModal.show(imageContainer, 'switchPage', {
							sign: -e.wheelDelta>0
						});
					}
                };
                if(document.body.addEventListener){
                    _boardImage.get(0).addEventListener("DOMMouseScroll", function(e){
                        var imageContainer=systemStatus.get('recentlyWindow');
						var img=$("#"+imageContainer.id).find('img').get(0);
						if(img.naturalWidth>0){
							modal.windowModal.show(systemStatus.get('recentlyWindow'), 'switchPage', {
								sign: e.detail>0
							});
						}
                    }, false);
                }
				
				_boardImage.on('mousedown mouseup','.panelCanvas',function(e){
					var dicomWindow=modal.windowModal.windows[this.id];
					var image=dicomWindow.image;
					switch(e.type){
						case 'mousedown':{
							if (e.which==3||event.button==2){ 
								track.mouse={x:e.pageX,y:e.pageY};
								track.state={
									windowWidth:image.state.windowWidth,
									windowCenter:image.state.windowCenter
								};								
							}
							break;
						}
						case 'mouseup':{
							if (e.which==3||event.button==2){ 
								image.changeStatus({
									//窗宽位的调整还涉及到整个窗口的大小,鼠标从窗口的一边滑倒另一边,数值的改变幅度为maxGray;
									windowWidth:track.state.windowWidth+Math.round((e.pageX-track.mouse.x)*image.maxGray/window.innerWidth),
									windowCenter:track.state.windowCenter+Math.round((e.pageY-track.mouse.y)*image.maxGray/2/window.innerHeight)
								});
								modal.windowModal.drawDicom(dicomWindow);
								//track=new Track();						
							}
							break;
						}
					}
				});
				
                //自动加载

                //ajax监听
                //用于自动加载图像数据
                //$(document).ajaxStop(function(){
                //    loadTimer=setTimeout(modal.imageModal.autoLoad(), 1000);
                //});
                //$(document).ajaxStart(function(){
                //    clearTimeout(loadTimer);
                //});
                //$("#order-downloadProgress").click(function(){
                //    clearTimeout(loadTimer);
                //});
            }
        }
    })();

    //公共接口
    //事件绑定及委托初始化,
    var init=function(){
        buttonControl.init();
        mouseControl.init();
        otherControl.init();
        //默认控制事件
        systemStatus.set('controlMode', 'swapPage');
    };
    window.control={
        init: init
    }
})();