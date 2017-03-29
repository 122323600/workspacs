/**
 * Created by jmupanda on 2016/5/5.
 */
/*
*
* */
onmessage = function(event) {
    var data = event.data;
    var re = '';
    var i, p, showWindowingInfo;
    switch (data.image.pixelBytes) {
        case 2:
        {
            var pixelNum = data.image.rows * data.image.columns * data.image.samplesPerPixel;
            var grayBoard = aLUTBoard(data.image, data.image.state.windowWidth, data.image.state.windowCenter, data.image.minGray, data.image.maxGray);
            if (data.image.state.antiColor) {
                for (i = 0; i < pixelNum; i += 1) {
                    p = 255 - grayBoard[data.image.pixelData[i]];
                    data.imageData.data[i * 4] = p;
                    data.imageData.data[i * 4 + 1] = p;
                    data.imageData.data[i * 4 + 2] = p;
                    data.imageData.data[i * 4 + 3] = 255;
                }
            } else if (data.image.state.pseudoColor) {
                var rgb = [];
                for (i = 0; i < pixelNum; i += 1) {
                    p = grayBoard[data.image.pixelData[i]];
                    rgb = pseudoColorChange(p);
                    data.imageData.data[i * 4] = rgb[0];
                    data.imageData.data[i * 4 + 1] = rgb[1];
                    data.imageData.data[i * 4 + 2] = rgb[2];
                    data.imageData.data[i * 4 + 3] = 255;
                }
            } else {
                for (i = 0; i < pixelNum; i += 1) {
                    p = grayBoard[data.image.pixelData[i]];
                    data.imageData.data[i * 4] = p;
                    data.imageData.data[i * 4 + 1] = p;
                    data.imageData.data[i * 4 + 2] = p;
                    data.imageData.data[i * 4 + 3] = 255;
                }
            }
            showWindowingInfo = {
                w: data.image.state.windowWidth,
                c: data.image.state.windowCenter
            };
        }
            break;
        case 3:
        {
            var brightness = data.image.state.brightness,
                contrast = data.image.state.contrast,
                threshold = data.image.state.threshold;
            pixelNum = data.image.rows * data.image.columns;
            if (data.image.state.antiColor) {
                for (i = 0; i < pixelNum; i++) {
                    data.imageData.data[i * 4] = 255 - BAndC(brightness, contrast, data.image.pixelData[i * 3], threshold);
                    data.imageData.data[i * 4 + 1] = 255 - BAndC(brightness, contrast, data.image.pixelData[i * 3 + 1], threshold);
                    data.imageData.data[i * 4 + 2] = 255 - BAndC(brightness, contrast, data.image.pixelData[i * 3 + 2], threshold);
                    data.imageData.data[i * 4 + 3] = 255;
                }
            } else {
                for (i = 0; i < pixelNum; i++) {
                    data.imageData.data[i * 4] = BAndC(brightness, contrast, data.image.pixelData[i * 3], threshold);
                    data.imageData.data[i * 4 + 1] = BAndC(brightness, contrast, data.image.pixelData[i * 3 + 1], threshold);
                    data.imageData.data[i * 4 + 2] = BAndC(brightness, contrast, data.image.pixelData[i * 3 + 2], threshold);
                    data.imageData.data[i * 4 + 3] = 255;
                }
            }
            showWindowingInfo = {
                w: brightness,
                c: contrast
            };
        }
            break;
    }
    postMessage({
        showWindowingInfo:showWindowingInfo,
        imageData: data.imageData
    });
};
function aLUTBoard(image, windowWidth, windowCenter, minGray, maxGray) {
    var dicom = image, state = dicom.state;
    if (dicom.windowWidth == 0 || dicom.windowCenter == 0) {// dicomԭͼ����δ�洢����λ���˴�ȫ����ʾ
        var maxCT = _ct_gray(image, "gray", maxGray);
        var minCT = _ct_gray(image, "gray", minGray);
        dicom.windowWidth = windowWidth = state.windowWidth = maxCT - minCT;
        dicom.windowCenter = windowCenter = state.windowCenter = Math["round"]((maxCT + minCT) / 2);
    }
    var showMinCT = windowCenter - (windowWidth >> 1),
        showMaxCT = windowCenter + (windowWidth >> 1);
    if (dicom.rescaleSlope == 0) {
        dicom.rescaleSlope = 1;
    }
    var showMinGray = _ct_gray(image, "ct", showMinCT);
    var showMaxGray = _ct_gray(image, "ct", showMaxCT);
    var grayPanel = [], i;
    var step = 255.0 / windowWidth;
    for (i = minGray; i < showMinGray; i++) {
        grayPanel[i] = 0;
    }
    for (i = showMinGray; i <= showMaxGray; i++) {
        grayPanel[i] = (i - showMinGray) * step;// ���Ա仯
    }
    for (i = showMaxGray + 1; i <= maxGray; i++) {
        grayPanel[i] = 255;
    }
    return grayPanel;
}
function pseudoColorChange (gray) {
    var r, g, b;
    if (gray < 64) {
        r = 0;
        g = 4 * gray;
        b = 255;
    } else if (gray < 128) {
        r = 0;
        g = 255;
        b = (127 - gray) * 4;
    } else if (gray < 192) {
        r = (gray - 128) * 4;
        g = 255;
        b = 0;
    } else {
        r = 255;
        g = (255 - gray) * 4;
        b = 0;
    }
    return [r, g, b];
}
function BAndC(brightness, contrast, pixel, threshold) {
    var a;
    if (contrast >= 0) {
        a = pixel + brightness;
        if (pixel > threshold) {
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
//CT-灰度转化
function _ct_gray(image, type, value){
    var dicom = image;
    if (!dicom) {
        return;
    }
    var slope = dicom.rescaleSlope, intercept = dicom.rescaleIntercept, newVal = value;
    if (slope == 0 && intercept == 0) {
        return value;
    }
    if (type === "ct") {
        newVal = (value - intercept) / slope;
    } else if (type == "gray") {
        newVal = value * slope + intercept;
    }
    return Math["floor"](newVal);
}