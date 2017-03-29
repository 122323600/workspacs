/**
 * Created by jmupanda on 2015/12/30.
 */
var toolProject = {
    //向量相加
    vectorAdd:function(){
        var result = {
            x:0,
            y:0,
            z:0
        };
        for (var k in arguments[0]){
            if (arguments[0].hasOwnProperty(k)){
                result[k] = arguments[0][k] + arguments[1][k];
            }
        }
        return result;
    },
    //向量相减
    vectorMinus:function(){
        var result = {
            x:0,
            y:0,
            z:0
        };
        for (var k in arguments[0]){
            if (arguments[0].hasOwnProperty(k)){
                result[k] = arguments[0][k] - arguments[1][k];
            }
        }
        return result;
    },
    //获取两点之间的长度
    getLength:function(){
        var result = 0;
        for (var k in arguments[0]){
            if (arguments[0].hasOwnProperty(k)){
                result = result + Math.pow(arguments[0][k] - arguments[1][k], 2);
            }
        }
        result = Math.sqrt(result);
        return result;
    },
    //点乘
    dotProduct:function(){
        var result = 0;
        result = arguments[0].x * arguments[1].x + arguments[0].y * arguments[1].y + arguments[0].z * arguments[1].z;
        return result;
    },
    //叉乘
    crossProduct:function(){
        var result = {};
        result.x = arguments[0].y * arguments[1].z - arguments[0].z * arguments[1].y;
        result.y = arguments[0].z * arguments[1].x - arguments[0].x * arguments[1].z;
        result.z = arguments[0].x * arguments[1].y - arguments[0].y * arguments[1].x;
        return result;
    },
    //获取两个向量的余弦值
    getVectorCos:function(){
        var magnitude = Math.sqrt(Math.pow(arguments[0].x, 2) + Math.pow(arguments[0].y, 2) + Math.pow(arguments[0].z, 2));
        magnitude = magnitude * Math.sqrt(Math.pow(arguments[1].x, 2) + Math.pow(arguments[1].y, 2) + Math.pow(arguments[1].z, 2));
        var dotProduct = this.dotProduct(arguments[0], arguments[1]);
        return dotProduct / magnitude;
    },
    //获取两个向量的法向量
    getNormalVector:function(){
        var aArray = this.getPoint(arguments[0]);
        return this.crossProduct(aArray[0], aArray[1]);
    },
    //分割字符串为点
    getPoint:function(){
        if (arguments[0] === "") return null;
        var a = arguments[0].split('|');
        var pointArray = [], point = {};
        for (var i = 0, l = a.length; i < l; i += 1){
            if ((i + 1) % 3 === 0){
                point.z = parseFloat(a[i]);
                pointArray.push(point);
                point = {};
            } else if ((i + 1) % 3 === 1){
                point.x = parseFloat(a[i]);
            } else {
                point.y = parseFloat(a[i]);
            }
        }
        if (pointArray.length === 1){
            return pointArray[0];
        }
        return pointArray;
    },
    //判断点是否穿过屏幕
    isCross:function(a, b, dvArray, pointArray){
        var result = {
            x: 0,
            y: 0,
            z: 0
        };
        if ((dvArray[a] > 0 && dvArray[b] < 0) || (dvArray[a] < 0 && dvArray[b] > 0)){
            for (var k in pointArray[a]){
                if (pointArray[a].hasOwnProperty(k)){
                    result[k] = pointArray[a][k] + (pointArray[b][k] - pointArray[a][k]) * dvArray[a] / (dvArray[a] - dvArray[b]);
                }
            }
            return result;
        } else {
            return false;
        }
    },
    //修改点位的相对坐标系
    pointToChange:function(point, aCanvas, mode){
        var dicom = aCanvas.cav;
        var bbox = dicom.get(0).getBoundingClientRect(),
            bbox2 = aCanvas.positioningLine_cav.get(0).getBoundingClientRect();
        var state = aCanvas.dicom.state,
            baseState = aCanvas.baseState,
            scale = state.scale * baseState.scale;
        var origin_x = bbox.left - bbox2.left + dicom.width() * scale / 2,
            origin_y = bbox.top - bbox2.top + dicom.height() * scale / 2;
        switch (mode){
            case 'draw':
                var point2 = {
                    x: point.x * scale * state.horizontal,
                    y: point.y * scale * state.vertical
                };
                var a = point2.x;
                if (state.rotate == 90){
                    point2.x = -point2.y;
                    point2.y = a;
                } else if (state.rotate == 180){
                    point2.x = -point2.x;
                    point2.y = -point2.y;
                } else if (state.rotate == 270){
                    point2.x = point2.y;
                    point2.y = -a;
                }
                point2.x = point2.x + origin_x;
                point2.y = point2.y + origin_y;
                break;
            case 'count':
                point2 = {
                    x: (point.x - origin_x) / scale * state.horizontal,
                    y: (point.y - origin_y) / scale * state.vertical
                };
                a = point2.x;
                if (state.rotate == 90){
                    point2.x = point2.y;
                    point2.y = -a;
                } else if (state.rotate == 180){
                    point2.x = -point2.x;
                    point2.y = -point2.y;
                } else if (state.rotate == 270){
                    point2.x = -point2.y;
                    point2.y = a;
                }
                break;
            default :
                console.log('ChangePoint Error:don.t have'+mode+'Mode');
        }
        return point2;

    },
    //判断dicom图像是否同步
    isSynchronous:function(dicom, dicom2){
        if (dicom.LOAD_STATE && dicom.LOAD_STATE === 'finish' && dicom.sliceLocation && (dicom.frameOfReferenceUid === dicom2.frameOfReferenceUid)){
            if(typeof(dicom2.normalVector) === 'object' && typeof(dicom.normalVector) === 'object'){
                if (Math.abs(this.getVectorCos(dicom2.normalVector, dicom.normalVector)) > 0.7){
                    return true;
                }
            }
        }
        return false;
    },
    //获取方向
    getDirection:function(pointArray){
        var direction = [];
        for (var i = 0, l = pointArray.length; i < l; i += 1){
            var aArray = pointArray[i];
            var a = 'x';
            for (var k in aArray){
                if(aArray.hasOwnProperty(k)){
                    if (Math.abs(aArray[k]) >= aArray[a]){
                        a = k;
                    }
                }
            }
            if (a == 'x'){
                if (aArray[a] > 0){
                    direction[i] = 1;
                } else {
                    direction[i] = -1;
                }
            } else if (a == 'y'){
                if (aArray[a] > 0){
                    direction[i] = 2;
                } else {
                    direction[i] = -2;
                }
            } else {
                if (aArray[a] > 0){
                    direction[i] = 3;
                } else {
                    direction[i] = -3;
                }
            }
        }
        return direction;
    },
	"showTip":function(msg){
		/**
		 * 简易的通用提示框
		 * @param msg
		 */
		//拼接html对象
		var html = '<div id="tipDivBorder"><div class="alert alert-info" role="alert">'+msg+'</div></div>';
		$("body").append(html);//将div对象插入body
		setTimeout(function(){			
				document.getElementById('tipDivBorder').remove(0);			
		}, 4000);//设置4秒后自动关闭弹窗
	}
};
var imageTool = {
    //CT\灰度值互转
    //CT值=原始的值*斜率+截距
    _ct_gray:function(image, type, value){
        var dicom = image;
        if (!dicom){
            return;
        }
        var slope = dicom.rescaleSlope, intercept = dicom.rescaleIntercept, newVal = value;
        if (slope == 0 && intercept == 0){
            return value;
        }
        if (type === "ct"){
            newVal = (value - intercept) / slope;
        } else if (type == "gray"){
            newVal = value * slope + intercept;
        }
        return Math["floor"](newVal);
    },
    //计算新RGB值
    BAndC:function(brightness, contrast, pixel, threshold){
        var a;
        if (contrast >= 0){
            a = pixel + brightness;
            if (pixel > threshold){
                a = a + (255 - threshold) * contrast / 255;
            } else {
                a = a - (threshold * contrast / 255);
            }
            return a;//newRGB=(RGB+Brightness)*(RGB-Threshold)*(1/(1-Contrast/255)-1)
        } else {
            a = pixel + (pixel - threshold) * contrast / 255;
            a = a + brightness;
            return a;//newRGB=(RGB+(RGB-Threshold)*Contrast/255)+Brightness
        }
    }
};
var measureTool = {
    coordinateChange:function(dicomWindow, point, type){
        //坐标系变换
        //图像的坐标会经常在"存储坐标系"和"绘制坐标系"之间变换
        //存储坐标系: 用于存储, 其原点是图像image的中心
        //绘制坐标系, 用于绘制, 其原点是画布canvas的左上角.
        var _cav = view.windowView.getWindowAttr(dicomWindow.id, '_cav'),
            bbox = _cav.get(0).getBoundingClientRect(),
            bbox2 = view.windowView.getWindowAttr(dicomWindow.id, 'measureCav')._cav.get(0).getBoundingClientRect();
        var state = dicomWindow.image.state,
            baseState = dicomWindow.baseState,
            scale = state.scale * baseState.scale;
        var origin_x = bbox.left - bbox2.left + _cav.width() * scale / 2,
            origin_y = bbox.top - bbox2.top + _cav.height() * scale / 2;//计算图像原点
        var a, point2 = {};
        if (type == "save"){
            //存储坐标系
            point2.x = (point.x - origin_x) / scale * state.horizontal;
            point2.y = (point.y - origin_y) / scale * state.vertical;
            a = point2.x;
            if (state.rotate == 90){
                point2.x = point2.y;
                point2.y = -a;
            } else if (state.rotate == 180){
                point2.x = -point2.x;
                point2.y = -point2.y;
            } else if (state.rotate == 270){
                point2.x = -point2.y;
                point2.y = a;
            }
        } else if (type == "draw"){
            //绘制坐标系
            point2 = {
                x: point.x * scale * state.horizontal,
                y: point.y * scale * state.vertical
            };
            a = point2.x;
            if (state.rotate == 90){
                point2.x = -point2.y;
                point2.y = a;
            } else if (state.rotate == 180){
                point2.x = -point2.x;
                point2.y = -point2.y;
            } else if (state.rotate == 270){
                point2.x = point2.y;
                point2.y = -a;
            }
            point2.x = point2.x + origin_x;
            point2.y = point2.y + origin_y;
        }
        return point2;
    },
    lengthWithImage:function(dicomWindow, point1, point2){
        //以图像为坐标系的长度
        var length = 0.00,
            image = dicomWindow.image,
            pixelSpacing = image.pixelSpacing == "" ? [1, 1]: image.pixelSpacing;
        length = parseFloat(Math.sqrt(Math.pow((point1.x - point2.x) * pixelSpacing[0], 2) + Math.pow((point1.y - point2.y) * pixelSpacing[1], 2)));
        length = length / (image.state.scale * dicomWindow.baseState.scale);
        length = length.toFixed(2);
        return length;
    },
    countLength:function(point1, point2){
        //基本两点长度运算
        if (!point1 || !point2) return null;
        return parseFloat(Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2)));
    },
    countAngle:function(point){
        //角度计算, 三点
        if (point.length < 3) return null;
        var line1 = this.countLength(point[0], point[1]);
        var line2 = this.countLength(point[1], point[2]);
        var line3 = this.countLength(point[0], point[2]);
        var angle = Math.acos((Math.pow(line1, 2) + Math.pow(line2, 2) - Math.pow(line3, 2)) / (2 * line1 * line2)) / Math.PI * 180;
        if (isNaN(angle)) angle = 180.00;
        return angle.toFixed(2);
    },
    countArea:function(image, graph){
        //面积计算
        //包含两种椭圆与矩形的面积计算以及图形内部灰度的一些值计算.
        if (graph.data.point.length < 2) return null;//如果图像的点不超过2个, 则无需计算
        var dicom = image,
            dicomData = dicom.pixelData,
            dicomDataNum = dicom.columns * dicom.rows;
        var pointArray = graph.data.point,
            point1 = {
                x: Math.round(pointArray[0].x + dicom.columns / 2),
                y: Math.round(pointArray[0].y + dicom.rows / 2)
            }, point2 = {
                x: Math.round(pointArray[1].x + dicom.columns / 2),
                y: Math.round(pointArray[1].y + dicom.rows / 2)
            };//计算左上和右下角的坐标
        var height = Math.abs(point1.y - point2.y),
            width = Math.abs(point1.x - point2.x),
            area = 0,
            perimeter = 0,
            pixelSpacing = dicom.pixelSpacing != "" ? dicom.pixelSpacing : [1, 1],//点距
            pixelNum = 0;
        var max = imageTool._ct_gray(image, 'gray',dicom.minGray),
            min = imageTool._ct_gray(image, 'gray',dicom.maxGray),
            average = 0, gray = 0,
            x, y, a, b = 0;
        if (height && width){
            if (graph.type == "square"){
                //矩形
                area = height * width * pixelSpacing[0] * pixelSpacing[1];
                perimeter = (height * pixelSpacing[1] + width * pixelSpacing[0]) * 2 ;
                pixelNum = width * height;
                for (var i = 0, l = height;i < l; i += 1){
                    for (var j = 0, m = width;j < m; j += 1){
                        var loc = point1.x + j + (point1.y + i) * dicom.columns;
                        if (point1.x < 0 || point1.y < 0 || point1.x + j > dicom.columns || typeof (dicomData[loc]) === 'undefined'){
                        } else {
                            gray = dicomData[loc];
                            average = average + gray;//平均灰度
                            max = (max > gray) ? max : gray;//最大灰度
                            min = (min > gray) ? gray : min;//最小灰度
                        }
                    }
                }
            } else if (graph.type == "circle"){
                //椭圆
                //椭圆的面积计算较复杂
                if (height >= width){
                    a = height;
                    b = width;
                } else {
                    a = width;
                    b = height;
                }
                area = height * width / 4 * Math.PI * pixelSpacing[0] * pixelSpacing[1];
                perimeter = (Math.PI * b + 2 * a - 2 * b) * pixelSpacing[0];
                var sign = false, type = (width > height);
                for (i = 0, l = height;i < l; i += 1){
                    for (j = 0, m = width;j < m; j += 1){
                        loc = point1.x + j + (point1.y + i) * dicom.columns;
                        if (point1.x + j< 0 || point1.y + i< 0 || point1.x + j > dicom.columns || point1.y + i > dicom.rows ||typeof (dicomData[loc]) === 'undefined'){
                        } else {
                            y = i - Math.round(height / 2);
                            x = j - Math.round(width / 2);
                            sign = this._inTheCircle(type, a, b, x, y);
                            if (sign){
                                gray = dicomData[loc];
                                average = average + gray;
                                max = (max > gray) ? max : gray;
                                min = (min > gray) ? gray : min;
                                pixelNum++;
                            }
                        }
                    }
                }
            }
            average = Math.round(average / pixelNum);
            return {
                area: area.toFixed(2),
                perimeter: perimeter.toFixed(2),
                max: max,
                min: min,
                average: average
            };
        }
    },
    _inTheCircle:function(type, a, b, x, y){
        //判断某点是否在椭圆内
        if (type){
            if (Math.pow(x, 2) / Math.pow(a / 2, 2) + Math.pow(y, 2) / Math.pow(b / 2, 2) <= 1){
                return true
            }
        } else {
            if (Math.pow(x, 2) / Math.pow(b / 2, 2) + Math.pow(y, 2) / Math.pow(a / 2, 2) <= 1){
                return true
            }
        }
        return false;
    },
    getLTAndRBPoint:function(shape){
        if (shape.point.length != 3) return null;
        var point1 = {}, point2 = {};
        if (shape.point[0].x == shape.point[1].x){
            if (shape.point[0].y > shape.point[1].y){
                point1.y = shape.point[1].y;
                point2.y = shape.point[0].y;
            } else {
                point1.y = shape.point[0].y;
                point2.y = shape.point[1].y;
            }
            if (shape.point[2].x > shape.point[3].x){
                point1.x = shape.point[3].x;
                point2.x = shape.point[2].x;
            } else {
                point1.x = shape.point[2].x;
                point2.x = shape.point[3].x;
            }
        } else {
            if (shape.point[2].y > shape.point[3].y){
                point1.y = shape.point[3].y;
                point2.y = shape.point[2].y;
            } else {
                point1.y = shape.point[2].y;
                point2.y = shape.point[3].y;
            }
            if (shape.point[0].x > shape.point[1].x){
                point1.x = shape.point[1].x;
                point2.x = shape.point[0].x;
            } else {
                point1.x = shape.point[0].x;
                point2.x = shape.point[1].x;
            }
        }
        return [point1, point2];
    },
    getFourPoint:function(point1, point2){
        //将两个点分割为四个点, 坐标分别为四条边的中点
        return [
            {x: (point1.x + point2.x) / 2, y: point1.y},
            {x: (point1.x + point2.x) / 2, y: point2.y},
            {x: point1.x, y: (point1.y + point2.y) / 2},
            {x: point2.x, y: (point1.y + point2.y) / 2}
        ]
    },
    pointInTheArea:function(origin, point, area){
        //判断某点是否在某个区域内
        if (point.x < origin.x + area && point.x > origin.x - area){
            if (point.y < origin.y + area && point.y > origin.y - area){
                return true;
            }
        }
        return false;
    },
    makeARect:function(ctx, point1, point2){
        //将线制成有一定高度的矩形, 用于模糊判断点是否在该线上
        var length = parseFloat(Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow(point1.y - point2.y, 2)));
        var rotate = Math.atan((point1.y - point2.y) / (point1.x - point2.x));
        ctx.save();
        ctx.translate((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
        ctx.rotate(rotate);
        ctx.beginPath();
        ctx.rect(-length / 2, -5, length, 10);
        ctx.closePath();
        ctx.restore();
    },

};