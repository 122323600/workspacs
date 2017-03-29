/**
*Created by jmupanda on 2016/3/23.
 */
(function(){
    if(window.modal) return;

    //公共工具类
    //普通工具
    var tool={
        //进行属性继承
        _extend:function(src,attrs){
            for (var k in attrs){
                if(attrs.hasOwnProperty(k)){
                    src[k]=attrs[k];
                }
            }
        }
    };
    //窗口模块
    var windowModal=(function(){
        var maxCols=4,
            maxRows=4,
            nowCols=1,
            nowRows=1;
        var windows={
        };
        //预加载计时器
        var preloadTimer=null;
        //每次预加载图像的数量
        var PRELOAD_NUM=3;
        //构造
        function DicomWindow(id){
            this.id=id;
            this.currentSeries=null;//当前操作的序列号
            this.currentIndex=null;//当前操作的图像号
            this.image={};// 当前操作的图像
            this.baseState={};//该窗当前的基础状态
            this.display=false;//是否显示中
            this.worker=null;//是否有在用的线程
        }
        //展示图像
        //某窗要显示某张图片或者重绘时,就调用这个方法
        DicomWindow.prototype.show=function(image,init){
            var that=this;
            if(!image){
                //若此窗没有图像显示,则隐藏图像信息,并清空该对象的内容
                view.windowView.getWindowMethod(this.id,'showPatientInfo');
                this.image=null;
                this.currentIndex=null;
                this.currentSeries=null;
                view.windowView.getWindowMethod(this.id,'clean');
                return false;
            }
            //显示加载中的消息
            view.windowView.getWindowMethod(this.id,'showMessage',{message:''});
            //清除定时器
            switch (image.LOAD_STATE){
                case 'finish' :
                    render(this,image,init);
                    break;
                case null :
                    image.load();
                case 'loading' :
                    image.LOAD_STATE='drawing';
                    var drawing=setInterval(function(){//创建定时器,定时查看图像状态用于加载.
                        if(image.LOAD_STATE === "finish"){
                            clearInterval(drawing);
                            render(that,image,init);
                        }
                    },500);
                    break;
                case 'drawing' :
                    break;
                default :
                    return false;
            }
        };
        //根据形态变化状态刷新当前canvas
        DicomWindow.prototype.transformCanvas=function(){
            var image=this.image;
            if(typeof(image.no) === 'undefined') return false;
            var link=systemStatus.get('link'),
                state=image.state;
            //调用视图方法
            view.windowView.getWindowMethod(this.id,'transformCanvas',{
                posx:state.posX+this.baseState.posX,
                posy:state.posY+this.baseState.posY,
                scale:state.scale*this.baseState.scale,
                rotate:state.rotate,
                horizontal:state.horizontal,
                vertical:state.vertical
            });
            //显示方向
            this.showDirection();
            //显示标尺
            this.showStaff();
            //刷新测量图案
            image.refreshGraphs(this);
        };
        //调窗设置
        DicomWindow.prototype.drawDicom=function(){
            var image=this.image;
            if(typeof(image.no) === 'undefined') return false;
            var state=image.state;
			var img=$("#"+this.id).find('img');
			console.info(modal.imageModal.imageData.filePath);
			img.css('display','block').get(0).src=RemoteProxy.getJpegURL()+'?filePath='+modal.imageModal.imageData.filePath+"\\"+image.fileName+"&windowWidth="+state.windowWidth+"&windowCenter="+state.windowCenter+"&rows="+ image.rows +"&columns="+ image.columns+"&inverse="+(state.antiColor?1:0);
			//显示窗宽位信息
			view.windowView.getWindowMethod(this.id,'showWindowingInfo',{w:state.windowWidth,c:state.windowCenter});
			img.on('load',function(e){
				if(this.naturalWidth>0){
				}else{
					view.windowView.getWindowMethod(this.id, 'showMessage',{message:'未找到要阅览的影像文件，请联系管理员。'});
				}
			});
        };
        //显示方向
        DicomWindow.prototype.showDirection=function(){
            //根据图像本身提供的方向数据,结合当前的图像状态,计算图像的方向.
            var image=this.image;
            if(!image || !image.direction) return false;
            var bottom=image.direction[1],
                right=image.direction[0],
                a,
                directionArray=['F','A','R','','L','P','H'];//方向:F脚,A前面,R右手,L左手,P背面,H头
            if(image.state.horizontal == -1){
                right=-right;
            }
            if(image.state.vertical == -1){
                bottom=-bottom;
            }
            if(image.state.rotate > 0){
                if(image.state.rotate == 90){
                    a=right;
                    right=-bottom;
                    bottom=a;
                }else if(image.state.rotate == 180){
                    right=-right;
                    bottom=-bottom;
                }else{
                    a=right;
                    right=bottom;
                    bottom=-a;
                }
            }
            bottom=directionArray[bottom+3];
            right=directionArray[right+3];
            view.windowView.getWindowMethod(this.id,'showDirection',{bottom:bottom,right:right});
        };
        //显示标尺
        DicomWindow.prototype.showStaff=function(){
            var image=this.image;
            if(typeof(image.no) === 'undefined') return false;
            var length=image.pixelSpacing[1] / (image.state.scale*this.baseState.scale) / 10;
            //图像每格的长度的计算:竖直方向的点距 / (图像放缩的比例*基础放缩比例) / 10
            view.windowView.getWindowMethod(this.id,'showStaff',{
                length:length
            });
        };
        //图像切换
        DicomWindow.prototype.switchPage=function(sign){
            if(typeof(this.image.no) === 'undefined') return;
            var singleSeriesSign=systemStatus.get('singleSeriesSign'),
                index=this.image.no,
                length=this.image.parentSeries.images.length,
				seriesNo=this.image.parentSeries.no,//当前序列号
				study=modal.imageModal.imageData;
			var img;
            if(sign){
                if(++index>=length){//下一序列
					if(seriesNo<study.series.length-1){					
						index=0;
						img=study.series[++seriesNo].images[index];	
						$('.order-info-part').removeClass('order-info-active');
						$('#order-info-part-'+seriesNo).addClass('order-info-active');								
					}else{
						return false;//超出范围
					}
				}else{//当前序列
					img=this.image.parentSeries.images[index];
				}
            }else{
                if(--index<0){//上一序列
					if(seriesNo>0){
						--seriesNo;
						index=study.series[seriesNo].images.length-1;
						img=study.series[seriesNo].images[index];
						$('.order-info-part').removeClass('order-info-active');
						$('#order-info-part-'+seriesNo).addClass('order-info-active');								
					}else{
						return false;//超出范围
					}
				}else{//当前序列
					img=this.image.parentSeries.images[index];
				}
            }
			this.show(img);
        };
        //绘制定位线
        DicomWindow.prototype.drawPositioningLine=function(dicomWindow){
            var crossPoint=toolProject.isSynchronous(this.image,dicomWindow.image) ? false :findCrossPoint(this.image,dicomWindow.image);
            //当操作窗口的dicom不与其他窗的dicom平行(或接近平行)
            view.windowView.getWindowCavMethod(this.id,'positioningLine','clean',{});
            if(crossPoint){
                var series=this.image.parentSeries,
                    firstDicom=series.images[0],
                    lastDicom=series.images[series.images.length-1];
                var modality=imageModal.imageData.modality;
                view.windowView.getWindowCavMethod(this.id,'positioningLine','draw',{
                    index:dicomWindow.image.no+1,
                    sign :true,
                    point1:measureTool.coordinateChange(this,crossPoint.point1,'draw'),
                    point2:measureTool.coordinateChange(this,crossPoint.point2,'draw')
                });
            }
        };
        //绘制病灶点
        DicomWindow.prototype.drawLesionsPoint=function(point3D,dicomWindow){
            var aSeries=this.image.parentSeries,
                index=getFirstPositionImg(aSeries),
                trueImage=index,//最接近病灶点的图片,
                image=aSeries.images[index];
            //图像还没加载完毕就不进行
            if(image.LOAD_STATE !== 'finish') return;
            var vector_o2=image.imagePositionPatient;//初始话对比数据
            //minDv用于存储最小距离,以此计算
            var minDv=(point3D.x-vector_o2.x)*image.normalVector.x+(point3D.y-vector_o2.y)*image.normalVector.y+(point3D.z-vector_o2.z)*image.normalVector.z;
            for (var k=index+1,n=aSeries.images.length; k<n; k += 1){
                //计算所有三维坐标到定位图的距离
                image=aSeries.images[k];
                if(image.LOAD_STATE !== 'finish') continue;
                vector_o2=image.imagePositionPatient;
                if(typeof(vector_o2) !== 'object') continue;
                var dv=(point3D.x-vector_o2.x)*image.normalVector.x+(point3D.y-vector_o2.y)*image.normalVector.y+(point3D.z-vector_o2.z)*image.normalVector.z;
                if(Math.abs(dv)<Math.abs(minDv)){
                    minDv=dv;
                    trueImage=k;
                }
            }
            image=aSeries.images[trueImage];//获取最小距离的图像
            var pointInTrueImage={//计算点击位置在该图上的投影
                x:point3D.x-minDv*image.normalVector.x,
                y:point3D.y-minDv*image.normalVector.y,
                z:point3D.z-minDv*image.normalVector.z
            };
            var vector=toolProject.vectorMinus(pointInTrueImage,image.imagePositionPatient),
                angle1=Math.acos(toolProject.getVectorCos(image.imageOrientationPatient.vector1,vector));
            angle1=toolProject.dotProduct(toolProject.crossProduct(image.imageOrientationPatient.vector1,vector),image.normalVector) > 0 ? -angle1 :angle1;//判断角的正负
            var length1=toolProject.getLength(pointInTrueImage,image.imagePositionPatient);

            pointInTrueImage={//将点转化为二维坐标,以供绘制
                x:(Math.round(length1*Math.cos(angle1))-image.columns / 2*image.pixelSpacing[0]) / image.pixelSpacing[0] ,
                y:(-Math.round(length1*Math.sin(angle1))-image.rows / 2*image.pixelSpacing[1]) / image.pixelSpacing[1]
            };
            //显示trueImage图像
            this.show(aSeries.images[trueImage]);
            //因为窗图像可能发生变动,那么需要重绘定位线
            if(systemStatus.get('positioningLine') && trueImage !== this.image.no){
                this.drawPositioningLine(dicomWindow);
            }
            //绘制
            view.windowView.getWindowCavMethod(this.id,'lesionsPoint','draw',{
                point:measureTool.coordinateChange(this,pointInTrueImage,'draw')
            });
        };
        //私有函数

        //单序列显示
        //所有窗口仅显示一个序列
        function synchronousInsideSeries(type,a,dicomWindow){
            var cols=nowCols,
                rows=nowRows,
                series=dicomWindow.image.parentSeries,
				study=modal.imageModal.imageData,
                id=getColAndRowFromID(dicomWindow.id),
                count1=id.r*cols+id.c,//当前窗位
                count2=rows*cols-1;//总窗位
            var i=0,j=0,maxIndex,minIndex;

            switch(type){
                case 1 ://switchIndex
					/*if(a){
						maxIndex=dicomWindow.image.no+1+count2-count1;
						if(maxIndex>=series.images.length){
							maxIndex=series.images.length-1;
						}
						minIndex=maxIndex-count2;
					}else{
						minIndex=dicomWindow.image.no-count1-1;
					}
					if(minIndex<0){
						minIndex=0;
					}								
					$.each(windows,function(){
						if(this.display){
							this.show(series.images[minIndex++],false);
						}
					});*/
					
					$.each(windows,function(i){
						if(this.display){
							var index=this.currentIndex,
								seriesNo=this.currentSeries,
								length=study.series[seriesNo].images.length;
																
							var img;
							if(a){
								if(++index>=length){//下一序列
									if(seriesNo<study.series.length-1){					
										index=0;
										img=study.series[++seriesNo].images[index];	
										if(i==0){
											$('.order-info-part').removeClass('order-info-active');
											$('#order-info-part-'+seriesNo).addClass('order-info-active');
										}
									}else{										
										return false;//超出范围
									}
								}else{//当前序列
									img=this.image.parentSeries.images[index];
								}
							}else{
								if(--index<0){//上一序列
									if(seriesNo>0){
										--seriesNo;
										index=study.series[seriesNo].images.length-1;
										img=study.series[seriesNo].images[index];
										if(i==0){
											$('.order-info-part').removeClass('order-info-active');
											$('#order-info-part-'+seriesNo).addClass('order-info-active');
										}								
									}else{										
										return false;//超出范围
									}
								}else{//当前序列
									img=this.image.parentSeries.images[index];
								}
							}								
							this.show(img,false);
						}
					});
					break;
                case 2 ://switchSeries
                    var singleSeriesSign=systemStatus.get('singleSeriesSign');
                    var minSeries=singleSeriesSign ? 0 :a,
                        images=imageModal.imageData.series[minSeries].images;
                    minIndex=singleSeriesSign ? a :0;
                    $.each(windows,function(){
                        if(this.display){
                            if(images[minIndex]){
                                this.show(images[minIndex],false);
                            }else{
                                this.show();
                            }
                            minIndex += 1;
                        }
                    });
                    break;
                default :
                    return false;
            }
        }

        // 同步序列判断
        function synchronousSeriesJudge (dicomWindow){
            var frameOfReferenceUID=dicomWindow.image.frameOfReferenceUid,
                sliceLocation=dicomWindow.image.sliceLocation;
            var imageData=imageModal.imageData;
            $.each(windows,function(){
                if((this.display && typeof(this.currentSeries) == 'number' && this.id !== dicomWindow.id)){
                    var aSeries=imageData.series[this.currentSeries],
                        index=getFirstPositionImg(aSeries),
                        minLocation=Math.abs(aSeries.images[index].sliceLocation-sliceLocation);

                    for (var k=index+1,n=aSeries.images.length; k<n; k += 1){
                        var dicom=aSeries.images[k];
                        if(toolProject.isSynchronous(dicom,dicomWindow.image)){
                            var nowLocation=Math.abs(dicom.sliceLocation-sliceLocation);
                            if(minLocation > nowLocation){
                                index=k;
                                minLocation=nowLocation;
                            }
                        }
                    }
                    if( aSeries.images[index].frameOfReferenceUid === frameOfReferenceUID && Math.abs(toolProject.getVectorCos(dicomWindow.image.normalVector,aSeries.images[index].normalVector)) > 0.7){
                        this.show(aSeries.images[index],false);
                    }
                }
            });
        }

        //从panel的ID中获取行列值
        function getColAndRowFromID(id){
            var r=parseInt(id.substring(id.indexOf("r")+1,id.indexOf("c")));
            var c=parseInt(id.substring(id.indexOf("c")+1));
            return {r:r,c:c};
        }

        //绘制图像
        function render(dicomWindow,image,isInit){
            //数据初始化
            dicomWindow.image=image;//赋予窗体数组新的数据与image指针
            dicomWindow.baseState=newState(image,dicomWindow);//形成基础状态
            dicomWindow.currentIndex=image.no;
            dicomWindow.currentSeries=image.parentSeries.no;
            if(isInit){
                image.resetStatus()
            }
            //绘制
            view.windowView.getWindowMethod(dicomWindow.id,'showMessage',{message:false});
            view.windowView.getWindowMethod(dicomWindow.id,'resetCanvasSize',{
                width:image.columns,
                height:image.rows
            });
            view.windowView.getWindowMethod(dicomWindow.id,'showPatientInfo',{
                patientName:image.patientName,
                patientSex:image.patientSex,
                patientAge:image.patientAge,
                patientSize:image.patientSize,
                patientWeight:image.patientWeight,
                studyTime:image.studyTime,
                studyDate:image.studyDate,
                modality:image.modality,
                seriesNumber:image.parentSeries.seriesNumber,
                imageNumber:image.no+1,
                imageCount:image.parentSeries.imageCount
            });
            dicomWindow.drawDicom();
            dicomWindow.transformCanvas();
            //以下为预加载
            //if(preloadTimer){
            //    clearTimeout(preloadTimer);
            //}
            //preloadTimer=setTimeout(function(){
            //    preload(image);
            //    preloadTimer=null;
            //},1000);
        }

        //寻找适合绘制定位线的窗口
        function findWindowToDrawPL(dicomWindow){
            if(nowCols === 1 && nowRows === 1 || typeof(dicomWindow.image.imagePositionPatient) !== 'object' ){
                //如果仅是单窗状态或者切片图没有定位信息或者图片为定位图,则不需要绘制
                return;
            }
            $.each(windows,function(){
                if(this.display && this.image && this.id !== dicomWindow.id){
                    this.drawPositioningLine(dicomWindow);
                }else{
                    view.windowView.getWindowCavMethod(this.id,'positioningLine','clean',{});
                }
            });
        }

        //寻找定位线的两点
        function findCrossPoint(dicom1,dicom2){//dicom1定位图,dicom2切片图
            if(typeof(dicom1.imagePositionPatient) !== 'object'){
                return false;//判断定位信息是否存在
            }
            //首先获取定位图的相关信息
            var vector_o1=dicom1.imagePositionPatient;//获取定位图左上点
            var rc=dicom1.imageOrientationPatient,
                vector_r1=rc.vector1,vector_c1=rc.vector2;//获取定位图方向向量
            var normalVector=dicom1.normalVector,
                pixelSpacing_1=dicom1.pixelSpacing;
            //获取切片图的相关信息
            var vector_o2=dicom2.imagePositionPatient;
            var rc=dicom2.imageOrientationPatient,
                vector_r2=rc.vector1,vector_c2=rc.vector2;
            var pixelSpacing_2=dicom2.pixelSpacing,
                srcHeight=dicom2.rows,
                srcWidth=dicom2.columns;
            //计算切片图四点坐标
            var pointArray= [];
            pointArray[0]=vector_o2;
            pointArray[1]={
                x:pointArray[0].x+vector_r2.x*pixelSpacing_2[1]*srcHeight,
                y:pointArray[0].y+vector_r2.y*pixelSpacing_2[1]*srcHeight,
                z:pointArray[0].z+vector_r2.z*pixelSpacing_2[1]*srcHeight
            };
            pointArray[2]={
                x:pointArray[1].x+vector_c2.x*pixelSpacing_2[0]*srcWidth,
                y:pointArray[1].y+vector_c2.y*pixelSpacing_2[0]*srcWidth,
                z:pointArray[1].z+vector_c2.z*pixelSpacing_2[0]*srcWidth
            };
            pointArray[3]={
                x:pointArray[0].x+vector_c2.x*pixelSpacing_2[0]*srcWidth,
                y:pointArray[0].y+vector_c2.y*pixelSpacing_2[0]*srcWidth,
                z:pointArray[0].z+vector_c2.z*pixelSpacing_2[0]*srcWidth
            };
            //计算矢量位移
            var dvArray=[];
            for (var i=0; i<4; i += 1){
                dvArray[i]=(pointArray[i].x-vector_o1.x)*normalVector.x+(pointArray[i].y-vector_o1.y)*normalVector.y+(pointArray[i].z-vector_o1.z)*normalVector.z;
            }
            //计算交点
            var crossPoint={},crossPointArray=[];
            for (var i=0; i<4; i += 1){
                if(i == 3){
                    crossPoint=toolProject.isCross(3,0,dvArray,pointArray);
                }else{
                    crossPoint=toolProject.isCross(i,i+1,dvArray,pointArray);
                }
                if(crossPoint){
                    crossPointArray.push(crossPoint);
                }
            }
            if(crossPointArray.length<2){
                return false;
            }
            //将crossPoint转换为二维坐标
            var vector_a1=toolProject.vectorMinus(crossPointArray[0],vector_o1),
                vector_a2=toolProject.vectorMinus(crossPointArray[1],vector_o1);
            var angle1=Math.acos(toolProject.getVectorCos(vector_r1,vector_a1)),
                angle2=Math.acos(toolProject.getVectorCos(vector_r1,vector_a2));
            angle1=toolProject.dotProduct(toolProject.crossProduct(vector_r1,vector_a1),dicom1.normalVector) > 0 ? -angle1 :angle1;//判断角的正负
            angle2=toolProject.dotProduct(toolProject.crossProduct(vector_r1,vector_a2),dicom1.normalVector) > 0 ? -angle2 :angle2;//判断角的正负
            var length1=toolProject.getLength(crossPointArray[0],vector_o1),
                length2=toolProject.getLength(crossPointArray[1],vector_o1);
            var point1={
                    x:(Math.round(length1*Math.cos(angle1))-dicom1.columns / 2*pixelSpacing_1[0]) / pixelSpacing_1[0] ,
                    y:(-Math.round(length1*Math.sin(angle1))-dicom1.rows / 2*pixelSpacing_1[1]) / pixelSpacing_1[1]
                },
                point2={
                    x:(Math.round(length2*Math.cos(angle2))-dicom1.columns / 2*pixelSpacing_1[0]) / pixelSpacing_1[0],
                    y:(-Math.round(length2*Math.sin(angle2))-dicom1.rows / 2*pixelSpacing_1[1]) / pixelSpacing_1[1]
                };
            return {
                point1:point1,
                point2:point2
            }
        }

        //绘制病灶点
        function drawLesionsPoint(point,dicomWindow){
            //point传入时,将从鼠标初始坐标mouse转换为基于DICOM图像中点的坐标
            point=measureTool.coordinateChange(dicomWindow,point,'save');
            //清除所有图上的病灶点
            view.windowView.cleanAllCav('lesionsPoint');
            //
            var image=dicomWindow.image,
                vector_o1=image.imagePositionPatient,//左上点
                rc=image.imageOrientationPatient,//向量
                vector_r1=rc.vector1,vector_c1=rc.vector2;//方向向量
            if(typeof(vector_o1) !== 'object'){
                return false;
            }
            //将坐标系原点从图像中点移至坐上点
            var pixelSpacing_1=image.pixelSpacing,//点距
                srcHeight=Math.round(point.x+image.rows / 2),//y
                srcWidth=Math.round(point.y+image.columns / 2);//x
            if(srcHeight<0 || srcHeight > image.rows || srcWidth<0 || srcWidth > image.columns){//超出了图像范围,则无需定位
                return false;
            }
            var point3D= {//计算该点的三维坐标
                x:vector_o1.x+vector_r1.x*pixelSpacing_1[1]*srcHeight+vector_c1.x*pixelSpacing_1[0]*srcWidth,
                y:vector_o1.y+vector_r1.y*pixelSpacing_1[1]*srcHeight+vector_c1.y*pixelSpacing_1[0]*srcWidth,
                z:vector_o1.z+vector_r1.z*pixelSpacing_1[1]*srcHeight+vector_c1.z*pixelSpacing_1[0]*srcWidth
            };
            //遍历窗口
            $.each(windows,function(){
                if(this.display && this.image && this.id !== dicomWindow.id){
                    this.drawLesionsPoint(point3D,dicomWindow);
                }
            });
        }

        //新状态:因为窗体有不同的宽高,所以部分状态需要进行适配
        function newState(dicom,dicomWindow){
            var state={},
                _window=$("#"+dicomWindow.id),
                sandBoxWidth=_window.width(),
                sandBoxHeight=_window.height();
            state.posX=(sandBoxWidth-dicom.columns) / 2;
            state.posY=(sandBoxHeight-dicom.rows) / 2;
            state.scale=(((sandBoxHeight / dicom.rows > sandBoxWidth / dicom.columns) ? sandBoxWidth / dicom.columns :sandBoxHeight / dicom.rows));
            return state;
        }

        //LUT灰度板制作
        function aLUTBoard(image,windowWidth,windowCenter,minGray,maxGray){
            var dicom=image,state=dicom.state;
            if(dicom.windowWidth == 0 || dicom.windowCenter == 0){// dicom原图像中未存储窗宽窗位，此处全窗显示
                var maxCT=imageTool._ct_gray(image,"gray",maxGray);
                var minCT=imageTool._ct_gray(image,"gray",minGray);
                dicom.windowWidth=windowWidth=state.windowWidth=maxCT-minCT;
                dicom.windowCenter=windowCenter=state.windowCenter=Math["round"]((maxCT+minCT) / 2);
            }
            var showMinCT=windowCenter-(windowWidth >> 1),
                showMaxCT=windowCenter+(windowWidth >> 1);
            // ct转换为gray
            if(dicom.rescaleSlope == 0){
                dicom.rescaleSlope=1;
            }
            var showMinGray=imageTool._ct_gray(image,"ct",showMinCT);
            var showMaxGray=imageTool._ct_gray(image,"ct",showMaxCT);
            // 生成灰度映射板
            var grayPanel=[],i;
            var step=255.0 / windowWidth;
            for (i=minGray; i<showMinGray; i++){
                grayPanel[i]=0;
            }
            for (i=showMinGray; i <= showMaxGray; i++){
                grayPanel[i]=(i-showMinGray)*step;// 线性变化
            }
            for (i=showMaxGray+1; i <= maxGray; i++){
                grayPanel[i]=255;
            }
            return grayPanel;
        }

        //灰度-彩色转换算法
        function pseudoColorChange (gray){
            var r,g,b;
            if(gray<64){
                r=0;
                g=4*gray;
                b=255;
            }else if(gray<128){
                r=0;
                g=255;
                b=(127-gray)*4;
            }else if(gray<192){
                r=(gray-128)*4;
                g=255;
                b=0;
            }else{
                r=255;
                g=(255-gray)*4;
                b=0;
            }
            return [r,g,b];
        }

        //获取序列中的第一张可定位的图片
        function getFirstPositionImg(series){
            var image;
            for (var i=0,l=series.images.length; i<l; i += 1){
                image=series.images[i];
                if(typeof(image.imagePositionPatient) == 'object'){
                    return i;
                }
            }
        }
        //预加载,当在某窗绘制一次图片时,则进行该窗图像序列的预加载
        function preload(image){
            var images=image.parentSeries.images,min=Math.floor(image.no / PRELOAD_NUM)
               *PRELOAD_NUM,max=PRELOAD_NUM+min,anotherImage;
            for (var i=0,l=images.length; i<l; i++){
                anotherImage=images[i];
                if(i>=min && i <= max){
                    if(!anotherImage.LOAD_STATE){
                        anotherImage.load();
                    }
                }
            }
        }


        //接口
        return {
            init:function(){
                var i,j,id='';
                //实例化窗体modal
                for (i=0; i<maxRows; i += 1){
                    for (j=0; j<maxCols; j += 1){
                        id="panelCanvas_r"+i+"c"+j;
                        windows[id]=new DicomWindow(id);
                    }
                }
                ////创建一个特殊窗体:单幅放大用窗体
                id="panelCanvasOutside";
                windows[id]=new DicomWindow(id);

                view.windowView.init(maxCols,maxRows);
                view.windowView.showWindow(nowCols,nowRows);
                //绘制
                var timer=setInterval(function(){
                    if(imageModal.imageData.series && imageModal.imageData.series.length > 0){
                        systemStatus.set('recentlyWindow',windows['panelCanvas_r0c0']);
                        windows['panelCanvas_r0c0'].show(imageModal.imageData.series[0].images[0],false);
                        windows['panelCanvas_r0c0'].display=true;
                        clearInterval(timer);
                    }
                },500);
            },
            //显示窗口
            showWindows :function(r,c){
                r=r ? r :nowRows;
                c=c ? c :nowCols;
                if(r <= maxRows && r > 0 && c > 0 && c <= maxCols){
                    //视图操作
                    view.windowView.showWindow(r,c);
                    //数据保存
                    nowRows=r;
                    nowCols=c;
                    //显示
                    var singleSeriesSign=systemStatus.get('singleSeriesSign'),
                        multipleSeriesSign=systemStatus.get('multipleSeries');
                    var imageNo=windows['panelCanvas_r0c0'].image.no,
                        seriesNo=windows['panelCanvas_r0c0'].image.parentSeries.no;
                    var firstIndex=singleSeriesSign ? imageNo :seriesNo,
                        minIndex=(Math.floor(firstIndex-c*r / 2)-1<0) ? 0 :(Math.floor(firstIndex-c*r / 2)-1),
                        l=singleSeriesSign ? imageModal.imageData.series[0].images.length :multipleSeriesSign ? imageModal.imageData.series.length :imageModal.imageData.series[seriesNo].images.length;
                    $.each(windows,function(){
                        this.display=false;
                        this.image=null;
                    });
                    for (var i=0; i<r; i += 1){
                        for (var j=0; j<c; j += 1){
                            var id='panelCanvas_r'+i+'c'+j ;
                            windows[id].display=true;
                            if(minIndex<l){
                                windows[id].show(singleSeriesSign || !multipleSeriesSign ? imageModal.imageData.series[seriesNo].images[minIndex] :imageModal.imageData.series[minIndex].images[0]);
                            }else{
                                windows[id].show();
                            }
                            minIndex += 1;
                        }
                    }
                    //改变默认操纵框
                    systemStatus.set('recentlyWindow',windows['panelCanvas_r0c0']);
                    if(!$('#panelCanvasOutside').is(':hidden')){
                        windows['panelCanvasOutside'].display=true;
                        windows['panelCanvasOutside'].show(windows['panelCanvasOutside'].image);
                        systemStatus.set('recentlyWindow', windows['panelCanvasOutside']);
                    }
                }
            },
            //由于以下两项操作涉及到联动操作,所以对于任何窗的操作都要有一个统一的入口,以便进行数据的转化
            transformCanvas:function(dicomWindow){
                var link=systemStatus.get('link');
                if(!link){
                    dicomWindow.transformCanvas();
                }else{
                    var baseImage=dicomWindow.image;
                    if(link === 1){
                        var images=dicomWindow.image.parentSeries.images;
                        //对该序列的状态进行改动
                        //对状态进行完全继承。因为同一序列下，状态互通。
                        for (var i=0,l=images.length; i<l; i += 1){
                            images[i].syncStatus('transform',baseImage);
                        }
                    }else if(link === 2){
                        //全联动则需要对所有图像的状态进行修改
                        var series=imageModal.imageData.series;
                        for (i=0,l=series.length; i<l; i++){
                            var aSeries=series[i];
                            for (var j=0,m=aSeries.images.length; j<m; j += 1){
                                aSeries.images[j].syncStatus('transform',baseImage);
                            }
                        }
                    }
                    $.each(windows,function(){
                        if(this.display && this.image){
                            if(link === 1){
                                this.currentSeries === dicomWindow.image.parentSeries.no && this.transformCanvas();
                            }else{
                                this.transformCanvas();
                            }
                        }
                    });
                }
            },
            //绘制图像
            drawDicom:function(dicomWindow){
                var link=systemStatus.get('link');
                if(!link){
                    dicomWindow.drawDicom();
                }else{
                    var baseImage=dicomWindow.image;
                    if(link === 1){
                        var images=dicomWindow.image.parentSeries.images;
                        //对该序列的状态进行改动
                        for (var i=0,l=images.length; i<l; i += 1){
                            images[i].syncStatus('windows',baseImage);
                        }
                    }else if(link === 2){
                        //全联动则需要对所有图像的状态进行修改
                        var series=imageModal.imageData.series;
                        for (i=0,l=series.length; i<l; i++){
                            var aSeries=series[i];
                            for (var j=0,m=aSeries.images.length; j<m; j += 1){
                                aSeries.images[j].syncStatus('windows',baseImage);
                            }
                        }
                    }
                    var seriesNo=dicomWindow.image.parentSeries.no;
                    $.each(windows,function(){
                        if(this.display && this.image){
                            if(link == 1){
                                this.currentSeries === baseImage.parentSeries.no && this.drawDicom();
                            }else{
                                if((this.image.windowWidth == baseImage.windowWidth && this.image.windowCenter == baseImage.windowCenter) || systemStatus.get('manSyncWindows') || this.image.parentSeries.no === baseImage.parentSeries.no){
                                    this.drawDicom();
                                }
                            }
                        }
                    });
                }

            },
            //show操作涉及到序列同步显示,定位线显示等功能,所以同样需要统一的接口,进行显示逻辑的实现
            show:function(dicomWindow,type,data){
                var link=systemStatus.get('link'),
                    multipleSeries=systemStatus.get('multipleSeries'),//多序列显示
                    positioningLine=systemStatus.get('positioningLine'),//定位线
                    seriesSynchronous=systemStatus.get('seriesSynchronous'),//序列同步
                    lesionsPoint=systemStatus.get('lesionsPoint');//病灶定位

                switch (type){
                    case 'orderClick':
                        if(nowRows === 1 && nowCols === 1){
                            dicomWindow.show(imageModal.imageData.series[data.seriesNo].images[data.imageNo]);
                        }else{
                            if(!multipleSeries){
                                synchronousInsideSeries(2,systemStatus.get('singleSeriesSign') ? data.imageNo :data.seriesNo,dicomWindow);
                            }else{
                                dicomWindow.show(imageModal.imageData.series[data.seriesNo].images[data.imageNo]);
                                if(seriesSynchronous){
                                    synchronousSeriesJudge(dicomWindow);
                                }
                                if(positioningLine){
                                    findWindowToDrawPL(dicomWindow);
                                }
                            }

                        }
                        break;
                    case 'switchPage':
                        if(nowRows === 1 && nowCols === 1){
                            dicomWindow.switchPage(data.sign);
                        }else{
                            if(!multipleSeries){
                                synchronousInsideSeries(1,data.sign,dicomWindow);
                            }else{
                                if(seriesSynchronous){
                                    dicomWindow.switchPage(data.sign);
                                    synchronousSeriesJudge(dicomWindow);
                                }else{
                                    if(nowRows === 1 && nowCols > 1){
                                        $.each(windows,function(){
                                            if(this.display && this.image){
                                                this.switchPage(data.sign);
                                            }
                                        });
                                    }else{
                                        dicomWindow.switchPage(data.sign);
                                    }
                                    if(positioningLine){
                                        findWindowToDrawPL(dicomWindow);
                                    }
                                }
                            }
                        }
                        break;
                }

            },
            //某窗被选中了
            selectWindow:function(id){
                var recentlyWindow=windows[id] && windows[id].display ? windows[id] :windows[0];
                systemStatus.set('recentlyWindow',recentlyWindow);

                //修改视图
                view.windowView.getWindowMethod(id,'selected',{});
                view.seriesView.seriesLight(systemStatus.get('singleSeriesSign') ? recentlyWindow.image.no :recentlyWindow.image.seriesNo);
                if(systemStatus.get('positioningLine')){
                    findWindowToDrawPL(recentlyWindow);
                }
                if(systemStatus.get('lesionsPoint')){
                    view.windowView.cleanAllCav('lesionsPoint');
                }
                return recentlyWindow;
            },
            findWindowToDrawPL:findWindowToDrawPL,
            drawLesionsPoint:drawLesionsPoint,
            //单幅放大
            windowZoom:function(dicomWindow){
                var outside=windows['panelCanvasOutside'];
                if(dicomWindow.id === 'panelCanvasOutside'){
                    var zoomWindow=systemStatus.get('zoomWindow');
                    systemStatus.set('recentlyWindow',zoomWindow);
                    zoomWindow.show(windows['panelCanvasOutside'].image);
                    outside.display=false;
                    view.windowView.windowZoom(false);
                }else{
                    if(nowCols > 1 || nowRows > 1){
                        outside.display=true;
                        systemStatus.set('recentlyWindow',outside);
                        systemStatus.set('zoomWindow',dicomWindow);
                        view.windowView.windowZoom(true);
                        outside.show(dicomWindow.image,false);
                    }
                }
            },
            windows:windows
        }
    })();
    //图像模块
    var imageModal=(function(){
        //图像模块加载完毕标志
        var isDone=false;
        //私有变量
        var imageData={
            filePath:'',//文件路径
            imageCount:0,//图像总数
            imageLoaded:0
        };
        //加载栈
        var loadNext=[];

        //序列构造
        function Series(no,data){
            tool._extend(this,data);
            this.no=no;
            this.images=[];
            this.loadNext=[];
        }
        //为序列添加一个新图像
        Series.prototype.addImage=function(data){
            this.images.push(new Image(this,this.images.length,data));
            this.loadNext.push(this.loadNext.length);
            imageData.imageCount += 1;
        };
        //显示序列信息
        Series.prototype.showSeriesToView=function(){
            var data={};
            data.type=systemStatus.get('singleSeriesSign')?2:1;
            data.no=this.no;
            data.modality=imageData.modality;
            data.seriesNumber=this.seriesNumber;
            data.imageCount=this.imageCount;
            if(this.imageCount){
                var filepath=RemoteProxy.getJpegURL()+'?filePath=';
                if(this.images[0].filePath){
                    filepath += this.images[0].filePath;
                }else{
                    filepath += (imageData.filePath+this.images[0].fileName);
                }
                filepath += '&rows=128&columns=128';
            }else{
                filepath='';
            }
            filepath += '&rows=128&columns=128';
            data.filePath=filepath;
            view.seriesView.appendSeries(data);
        };
        //显示该序列的所有图像信息
        Series.prototype.showImagesToView=function(){
            for (var i=0,l=this.images.length; i<l; i += 1){
                var data={};
                data.type=systemStatus.get('singleSeriesSign')?2:1;
                data.no=i;
                data.modality=imageData.modality;
                data.imageCount=this.imageCount;
                var filepath=RemoteProxy.getJpegURL()+'?filePath=';
                if(this.images[i].filePath){
                    filepath += this.images[i].filePath;
                }else{
                    filepath += (imageData.filePath+this.images[i].fileName);
                }
                filepath += '&rows=128&columns=128';
                data.filePath=filepath;
                view.seriesView.appendSeries(data);
            }
        };
        //选中该序列
        Series.prototype.lightUp=function(){
            view.seriesView.seriesLight(this.no);
        };
        //序列加载动画
        Series.prototype.loadProcess=function(imageNo){
            this.loadNext.splice(this.loadNext.indexOf(imageNo),1);
            if(this.loadNext.length === 0) this.LOAD_STATE='finish';
            imageData.imageLoaded += 1;
            view.seriesView.loadProcess(this.no,1-this.loadNext.length / this.images.length);
        };

        //图像构造
        function Image(series,no,data){
            tool._extend(this,data);
            this.parentSeries=series;
            this.no=no;
            this.LOAD_STATE=null;//加载状态
            this.state={};//图像状态
            this.measureData={//测量对象
                graphs:[],
                imageData:null
            };
        }
        //加载
        Image.prototype.load=function(){
            //已在加载
            if(this.LOAD_STATE) return;
            var that=this;
            //改变加载状态
            that.LOAD_STATE='loading';
            //修改加载栈
            //推入一张新图像
            var series=this.parentSeries;
            if(series.loadNext.length > 1){
                loadNext.push(series.images[series.loadNext[1]]);
            }else{
                for (var i=0,l=imageData.series.length; i<l; i += 1){
                    var aSeries=imageData.series[i];
                    if(aSeries.loadNext.length > 1){
                        loadNext.push(aSeries.images[aSeries.loadNext[0]]);
                        break;
                    }
                }
            }
            //如果离线存储可用
            //则要查找图像
            if(systemStatus.get('indexedDB')){
                indexedDBModal.getData(that.imageUid,function(e){
                    if(e.target.result){
                        getImageData(that,e.target.result.dicomObject);
                        perload();
                    }else{
                        getDataFormAjax(that);
                    }
                },function(e){
                    getDataFormAjax(that);
                });
            }else{
                getDataFormAjax(that);
            }
        };
        //状态重置
        Image.prototype.resetStatus=function(){//init为是否初始化的标志
            var state=this.state;
            state.antiColor=false;//反色标志
            state.pseudoColor=false;//伪彩标志
            state.windowWidth=this.windowWidth;// 窗宽
            state.windowCenter=this.windowCenter;//窗位
            state.posX=0;//位置X轴
            state.posY=0;//位置Y轴
            state.scale=1;//缩小比例
            state.horizontal=1;//水平翻转
            state.vertical=1;//垂直翻转
            state.rotate=0;// 旋转角度
            if(this.pixelBytes === 3){//三位图数据补充
                state.contrast=this.contrast;//对比度
                state.brightness=this.brightness;//亮度
                state.threshold=this.threshold;//
            }
        };
        //状态同步
        Image.prototype.syncStatus=function(type,image,manSign){
            if(!type || !image) return;
            var syncSign=systemStatus.get('manSyncWindows'),
                baseState=image.state,
                thisState=this.state;
            switch (type){
                case 'all':
                    if(syncSign || manSign){
                        thisState=$.extend(true,{},baseState);
                    }else{
                        thisState.antiColor=baseState.antiColor;
                        thisState.pseudoColor=baseState.pseudoColor;
                        thisState.posX=baseState.posX;
                        thisState.posY=baseState.posY;
                        thisState.scale=baseState.scale;
                        thisState.horizontal=baseState.horizontal;
                        thisState.vertical=baseState.vertical;
                        thisState.rotate=baseState.rotate;
                        if(this.windowWidth === image.windowWidth && this.windowCenter === image.windowCenter){
                            thisState.windowWidth=baseState.windowWidth;
                            thisState.windowCenter=baseState.windowCenter;
                        }
                        if(this.pixelBytes === 3){
                            if(baseState.brightness) thisState.brightness=baseState.brightness;
                            if(baseState.contrast) thisState.contrast=baseState.contrast;
                            if(baseState.threshold) thisState.threshold=baseState.threshold;
                        }
                    }
                    break;
                case 'transform':
                    thisState.antiColor=baseState.antiColor;
                    thisState.pseudoColor=baseState.pseudoColor;
                    thisState.posX=baseState.posX;
                    thisState.posY=baseState.posY;
                    thisState.scale=baseState.scale;
                    thisState.horizontal=baseState.horizontal;
                    thisState.vertical=baseState.vertical;
                    thisState.rotate=baseState.rotate;
                    break;
                case 'windows':
                    if((this.windowWidth === image.windowWidth && this.windowCenter === image.windowCenter) || syncSign || this.parentSeries.no === image.parentSeries.no){
                        thisState.windowWidth=baseState.windowWidth;
                        thisState.windowCenter=baseState.windowCenter;
                        thisState.antiColor=baseState.antiColor;
                        thisState.pseudoColor=baseState.pseudoColor;
                    }
                    if(this.pixelBytes === 3 || this.parentSeries.no === image.parentSeries.no){
                        if(baseState.brightness) thisState.brightness=baseState.brightness;
                        if(baseState.contrast) thisState.contrast=baseState.contrast;
                        if(baseState.threshold) thisState.threshold=baseState.threshold;
                    }
                    break;
            }
        };
        //状态修改
        Image.prototype.changeStatus=function(data){
            var state=this.state;
            for (var id in data){
                if(data.hasOwnProperty(id)){
                    switch (id){
                        //反色和伪彩不会同时出现
                        case 'antiColor':
                            if(state.antiColor == true){
                                state.antiColor=false;
                            }else{
                                state.antiColor=true;
                                state.pseudoColor=false;
                            }
                            break;
                        case 'pseudoColor':
                            if(state.pseudoColor == true){
                                state.pseudoColor=false;
                            }else{
                                state.pseudoColor=true;
                                state.antiColor=false;
                            }
                            break;
                        //限制旋转的度数在0~360的范围之内
                        case 'rotate' :
                            var rotate1=data.rotate % 360;
                            state.rotate=rotate1>=0 ? rotate1 :360+rotate1;
                            break;
                        //窗宽位的默认窗与全窗
                        case 'windowWidth' :
                        case 'windowCenter':
                            if(data[id] === "defaults"){
                                state.windowWidth=this.windowWidth;
                                state.windowCenter=this.windowCenter;
                            }else if(data[id] === "full"){
                                var maxCT=imageTool._ct_gray(this,"gray",this.maxGray),
                                    minCT=imageTool._ct_gray(this,"gray",this.minGray);
                                state.windowWidth=maxCT-minCT;
                                state.windowCenter=Math["round"]((maxCT+minCT) / 2);
                            }else{
                               state[id]=data[id];
                            }
                            break;
                        //通过亮度与对比度的变化,计算平均灰度
                        case 'brightness' :
                            if(data.hasOwnProperty('contrast')){
                                break;
                            }
                        case 'contrast' :
                            var brightness=data.hasOwnProperty('brightness') ? data['brightness'] :state.brightness,
                                contrast=data.hasOwnProperty('contrast') ? data['contrast'] :state.contrast;
                            brightness=Math.round(Math.max(-255,Math.min(255,brightness || 0)));//限制亮度和对比度的大小
                            contrast=Math.round(Math.max(-255,Math.min(255,contrast || 0)));
                            state.brightness=brightness;
                            state.contrast=contrast;
                            state.threshold=imageTool.BAndC(brightness,contrast,state.threshold,state.threshold);
                            break;
                        //进行最大化和最小化的限制
                        case 'scale' :
                            state.scale=data[id]<0.1 ? 0.1 :data[id] > 5 ? 5 :data[id];
                            break;
                        default :
                            state[id]=data[id];
                    }
                    if(isNaN(state[id])){
                        this.resetStatus();
                        break;
                    }
                }
            }
        };
        //添加图形
        Image.prototype.addGraph=function(data){
            var graph=new Graph();
            graph.parentImage=this;
            graph.type=data.type;
            //添加序号
            if(this.measureData.graphs.length == 0){
                graph.no=1;
            }else{
                graph.no=this.measureData.graphs[this.measureData.graphs.length-1].no+1;
            }
            graph.data=data.data;

            //通过addGraph传进来的是以某窗为坐标系的坐标,因此要转化成以图像本身为坐标系的坐标进行存储
            for (var i=0,l=graph.data.point.length; i<l; i += 1){
                graph.data.point[i]=measureTool.coordinateChange(data.dicomWindow,graph.data.point[i],'save')
            }
            //推入数组
            this.measureData.graphs.push(graph);
            return graph;
        };
        //重绘所有图形
        Image.prototype.refreshGraphs=function(dicomWindow){
            dicomWindow=dicomWindow ? dicomWindow :systemStatus.get('recentlyWindow');
            //view.windowView.getWindowCavMethod(dicomWindow.id,'measure','clean',{});
            if(dicomWindow){
                var graphs=this.measureData.graphs;
                for (var i=0,l=graphs.length; i<l ; i += 1){
                    graphs[i].draw(dicomWindow);
                }
            }
        };

        //预载逻辑
        function perload(){
            var nextImage=loadNext.shift();
            if(!loadNext.length){
                //此处是为了保证
                //无论同时有几次加载产生
                //最后仅有一次预加载能被执行
                nextImage && nextImage.load();
            }
        }
        //从indexedDB去获取数据
        function getDataFormIndexedDB(){

        }
        //从ajax去获取数据
        function getDataFormAjax(that){
            //组合文件路径
            if(that.filePath){
                var file=that.filePath;
            }else{
                file=imageData.filePath+that.fileName;
            }
            //请求图像数据
            RemoteProxy.getInfo({
                filePath:file,
                size:0
            },function(dicomObject){
                systemStatus.get('indexedDB') && indexedDBModal.addData([{uid:that.imageUid,dicomObject:dicomObject}]);
                //alert('获取图像数据');
                getImageData(that,dicomObject);
                perload();
            },function(error){
                view.windowView.getWindowMethod(systemStatus.get('recentlyWindow').id, 'showMessage',{message:'未找到要阅览的影像文件，请联系管理员。'});
            });
        }
        //获取到图像数据后的处理
        function getImageData(that,dicomObject){ //断点
        	if(dicomObject && dicomObject.rows==0){dicomObject.rows=500};
        	if(dicomObject && dicomObject.columns==0){dicomObject.columns=500};
            if(dicomObject && (dicomObject.rows || dicomObject.columns)){
                //继承获得的属性值
                tool._extend(that,dicomObject);
                imageDataModify(that,dicomObject);
                //加载初始状态值
                if(typeof(that.state.antiColor) === 'undefined') that.resetStatus();
                //修改加载状态
                that.LOAD_STATE="finish";
                //修改该序列的加载进度条
                that.parentSeries.loadProcess(that.no);
            }else{
                that.LOAD_STATE='fail'
            }
        }
        //数据补充
        function imageDataModify(that,dicomObject){
            //计算图像法向量,计算图像方向
            if(typeof(dicomObject.imageOrientationPatient) === 'string' && dicomObject.imageOrientationPatient !== ''){
                var aArray=toolProject.getPoint(dicomObject.imageOrientationPatient);
                that.imageOrientationPatient={
                    vector1:aArray[0],
                    vector2:aArray[1]
                };//图片方向向量
                that.normalVector=toolProject.crossProduct(aArray[0],aArray[1]);//法向量
                that.direction=toolProject.getDirection(aArray);//方向
                that.imagePositionPatient=typeof(dicomObject.imagePositionPatient) !== 'undefined' ? toolProject.getPoint(that.imagePositionPatient) :null;//原点位置
            }
            //判断是否为定位图以及数据分割
            that.isLocalizer=(typeof(that.imageType) !== 'undefined' && that.imageType.match(new RegExp('localizer','i')))
            || (typeof(that.seriesDescription) !== 'undefined' && that.seriesDescription.match(new RegExp('localizer','i'))) ? true :false;
            that.pixelSpacing=that.pixelSpacing == "" ? that.pixelSpacing :that.pixelSpacing.split('|');
            that.pixelSpacing[0]=that.pixelSpacing[0] == "" || that.pixelSpacing[0] == 0 ? 1 :parseFloat(that.pixelSpacing[0]);
            that.pixelSpacing[1]=that.pixelSpacing[1] == "" || that.pixelSpacing[1] == 0 ? 1 :parseFloat(that.pixelSpacing[1]);
            //三位图数据补充
/*            if(that.pixelBytes === 3){
                that.contrast=1;
                that.brightness=0;
                var pixelNum=that.rows*that.columns,allValue=0;
                for (var i=0; i<pixelNum; i++){
                    allValue += that.pixelData[i];
                }
                that.threshold=allValue / pixelNum;
            }*/
        }

        //测量图形构造
        function Graph(){
            //parentImage
            //type
            //no
            //data
        }
        //在指定窗或者当前窗下绘制该图像
        Graph.prototype.draw=function(dicomWindow){
            dicomWindow=dicomWindow ? dicomWindow :systemStatus.get('recentlyWindow');
            var points=[];
            for (var i=0,l=this.data.point.length; i<l; i += 1){
                points.push(measureTool.coordinateChange(dicomWindow,this.data.point[i],"draw"));
            }
            view.windowView.getWindowCavMethod(dicomWindow.id,'measure',this.type,{
                point:points,
                length:this.type == 'line' ? measureTool.lengthWithImage(dicomWindow,points[0],points[1]) :null,
                pixelSpacing:this.parentImage.pixelSpacing,
                angle:this.type == 'angle' ? measureTool.countAngle(this.data.point) :null,
                area:this.type == 'square' || this.type == 'circle' ? this.data.area :null,
                text:this.type == 'textNote' ? this.data.text :null
            });
        };
        //将自己从数组中剔除,然后等待垃圾回收机制回收自己
        Graph.prototype.delete=function(){
            var graphs=this.parentImage.measureData.graphs;
            for (var i=0,l=graphs.length; i<l; i += 1){
                if(graphs[i].no == this.no){
                    graphs.splice(i,1);
                    break;
                }
            }
        };
        //改变数组内容,注意,传入的是以某窗为坐标轴的点
        Graph.prototype.changePoint=function(pos,point,dicomWindow){
            dicomWindow=dicomWindow ? dicomWindow :systemStatus.get('recentlyWindow');
            this.data.point[pos-1]=measureTool.coordinateChange(dicomWindow,point,'save')
        };
        //根据传入的以某窗为坐标轴的点,来判断自己是否在这个点下
        Graph.prototype.found=function(mouse){
            //此时的操作必然是在当前窗下
            var dicomWindow=systemStatus.get('recentlyWindow');
            var i,j,l;
            var loc=measureTool.coordinateChange(dicomWindow,mouse,"save");//坐标变化
            var graph=this;
            //先找点
            var points=graph.data.point;
            //对与这两个图形,需要将存储的两个点变成上下左右四个点
            if(graph.type === "square" || graph.type === "circle"){
                points=measureTool.getFourPoint(graph.data.point[0],graph.data.point[1]);
            }
            for (i=0,j=points.length; i<j; i += 1){
                if(measureTool.pointInTheArea(points[i],loc,6)){
                    graph.showPoints(dicomWindow);
                    //改变鼠标指针的样式
                    view.windowView.cursorStyle('move');
                    //返回数据
                    return {
                        type:'point',
                        no:i,
                        graph:graph
                    };
                }
            }
            //后找图形
            //找图形需要在画布上模拟图形,同时将坐标转化回去
            loc=mouse;//坐标变化
            var ctx=view.windowView.getWindowAttr(dicomWindow.id,'measureCav').ctx;
            var point1,point2;
            if(graph.type === "square" || graph.type === "circle"){
                point1=graph.data.point[0];
                point2=graph.data.point[1];
                point1=measureTool.coordinateChange(dicomWindow,point1,"draw");
                point2=measureTool.coordinateChange(dicomWindow,point2,"draw");
                ctx.beginPath();
                if(graph.type === "square"){
                    ctx.rect(point1.x,point1.y,point2.x-point1.x,point2.y-point1.y);
                }else{
                    ctx.save();
                    var x=(point1.x+point2.x) / 2,
                        y=(point1.y+point2.y) / 2,
                        a=Math.abs(point1.x-point2.x) / 2,
                        b=Math.abs(point1.y-point2.y) / 2;
                    ctx.translate(x,y);
                    //选择a、b中的较大者作为arc方法的半径参数
                    var r=(a > b) ? a :b;
                    var ratioX=a / r; //横轴缩放比率
                    var ratioY=b / r; //纵轴缩放比率
                    ctx.scale(ratioX,ratioY); //进行缩放（均匀压缩）
                    //从椭圆的左端点开始逆时针绘制
                    ctx.moveTo(a / ratioX,0);
                    ctx.arc(0,0,r,0,2*Math.PI);
                    ctx.restore();
                }
                ctx.closePath();
                if(ctx.isPointInPath(loc.x,loc.y)){
                    //改变鼠标指针的样式
                    view.windowView.cursorStyle('move');
                    //显示四点
                    graph.showPoints(dicomWindow);
                    return {
                        type:'graph',
                        graph:graph
                    };
                }
            }else if(graph.type === "text"){
                var shapeTextMirror= $("#shapeTextMirror");
                shapeTextMirror.text(graph.text);
                point1=measureTool.coordinateChange(dicomWindow,graph.data.point[0],"draw");
                point2={
                    x:point1.x+shapeTextMirror.width()+8,
                    y:point1.y
                };
                measureTool.makeARect(ctx,point1,point2);
                if(ctx.isPointInPath(loc.x,loc.y)){
                    //改变鼠标指针的样式
                    view.windowView.cursorStyle('text');
                    return {
                        type:'graph',
                        graph:graph
                    };
                }
            }else{
                for (j=graph.data.point.length-1; j > 0; j -= 1){
                    point1=measureTool.coordinateChange(dicomWindow,graph.data.point[j],"draw");
                    point2=measureTool.coordinateChange(dicomWindow,graph.data.point[j-1],"draw");
                    measureTool.makeARect(ctx,point1,point2);
                    if(ctx.isPointInPath(loc.x,loc.y)){
                        //改变鼠标指针的样式
                        view.windowView.cursorStyle('move');
                        return {
                            type:'graph',
                            graph:graph
                        };
                    }
                }
            }
            view.windowView.cursorStyle('default');
            view.windowView.getWindowCavMethod(dicomWindow.id,'measure','set',{imageData:dicomWindow.image.measureData.imageData});
            return null;
        };
        //展示该形状的点,仅矩形和圆
        Graph.prototype.showPoints=function(dicomWindow){
            dicomWindow=dicomWindow ? dicomWindow :systemStatus.get('recentlyWindow');
            if(this.type === 'square' || this.type === 'circle'){
                view.windowView.getWindowCavMethod(dicomWindow.id,'measure','set',{imageData:dicomWindow.image.measureData.imageData});
                var points=measureTool.getFourPoint(this.data.point[0],this.data.point[1]);
                for (var i=points.length-1; i>=0; i -= 1){
                    view.windowView.getWindowCavMethod(dicomWindow.id,'measure','point',measureTool.coordinateChange(dicomWindow,points[i],"draw"));
                }
            }
        };
        //获取该形状的面积数据,仅矩形和圆
        Graph.prototype.getArea=function(){
            if(this.type === 'square' || this.type === 'circle'){
                this.data.area=measureTool.countArea(this.parentImage,this);
            }
        };
        //改变文字内容,仅限文字标注

        //私有方法
        //在视图上显示Series
        function appendSeries(){
            //加载完后进行绘制
            systemStatus.set('singleSeriesSign',imageData.series.length === 1);//单序列判断
            if(imageData.series.length === 1){
                imageData.series[0].showImagesToView();
            }else{
                for (var i=0,l=imageData.series.length; i<l; i += 1){
                    imageData.series[i].showSeriesToView();
                }
            }
        }

        //初始加载数据
        function loadImageData(study){
            var that=this;
            var param=study ? JSON.stringify(study) :{};
            RemoteProxy.getStudy({
                param:param
            },function(data){
                if(!data){
                    view.windowView.getWindowMethod(this.id,'showMessage',{message:'未找到要阅览的影像文件，请联系管理员。'});
                }else{
                    if(data.series.length){
                        //数据重构造
                        imageData.filePath=data.localPath+"\\"+data.storePath+"\\";//组合文件路径
                        tool._extend(imageData,data);
                        imageData.series=[];
                        //序列构造
                        for (var i=0,l=data.series.length; i<l; i += 1){
                            var series=new Series(i,data.series[i]);
                            //图像构造
                            if(data.series[i].images){
                                for (var j=0,m=data.series[i].images.length; j<m; j += 1){
                                    series.addImage(data.series[i].images[j]);
                                }
                            }
                            imageData.series.push(series);
                        }
                        //添加序列至视图
                        appendSeries();
                        imageData.series[0].lightUp();
                        view.seriesView.init(data.series.length,imageData.imageCount);
                    }else{
                        view.windowView.getWindowMethod(this.id,'showMessage',{message:'当前没有影像文件可以浏览。'});
                    }
                    isDone=true;
                }
            },function(){
                view.windowView.getWindowMethod(this.id,'showMessage',{message:'未找到要阅览的影像文件，请联系管理员。'});
            });
        }

        return {
            init:function(study){
                loadImageData(study);//初始化数据
            },
            autoLoad:function(){
                if(imageData.series.length && isDone){
                    var recentlyWindow=systemStatus.get('recentlyWindow');
                    if(recentlyWindow){
                        var image=recentlyWindow.image,
                            num=0,i,l;
                        if(image && !systemStatus.get('singleSeriesSign') && image.parentSeries.LOAD_STATE){
                            for (i=0,l=imageData.series.length; i<l; i += 1){
                                var aSeries=imageData.series[i];
                                if(!aSeries.LOAD_STATE){
                                    for (var j=0,m=aSeries.images.length; j<m; j += 1){
                                        if(!aSeries.images[j].LOAD_STATE){
                                            aSeries.images[j].load();
                                            num += 1;
                                            //if(num === 5){break;}
                                        }
                                    }
                                    break;
                                }
                            }
                        }else{
                            for (i=0,l=image.parentSeries.images.length; i<l; i += 1){
                                if(!image.parentSeries.images[i].LOAD_STATE){
                                    num += 1;
                                    image.parentSeries.images[i].load();
                                   // if(num === 5){break;}
                                }
                            }
                        }
                    }
                }
            },
            imageData:imageData
        }
    })();
    window.modal={
        init:function(study){
            //打开离线存储
            //window.indexedDBModal.openDB(function(){
            //    //模块初始化
            //    imageModal.init(study);
            //    windowModal.init();
            //    systemStatus.set('indexedDB',false);
            //});

            //不使用离线存储模块
            imageModal.init(study);
            windowModal.init();
            systemStatus.set('indexedDB',false);

        },
        imageModal:imageModal,
        windowModal:windowModal
    }
})();