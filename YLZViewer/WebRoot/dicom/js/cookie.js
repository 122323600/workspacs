//	根据cookie名称获取对应的cookie值
//	参数:	name cookie名
//	返回:	cookie值，不存在返回""
function getCookie(name){
    if (document.cookie.length > 0){
        var start=document.cookie.indexOf(name + "=");
        if (start != -1){ 
            start = start + name.length + 1;
            var end = document.cookie.indexOf(";", start);
            if (end == -1) 
                end = document.cookie.length;
            return document.cookie.substring(start, end);
            //return unescape(document.cookie.substring(nStart, nEnd));
        } 
    }
    return null;
} 

//	根据cookie名称设置对应的cookie值
//	参数:	name cookie名
//		value cookie值
//		expires cookie作用时间
//		path cookie作用路径
//		domain cookie作用域
//		secure 是否使用安全cookie
//	返回:	无
function setCookie(name, value, expires, path, domain, secure){
	deleteCookie(name) ;  
    var today = new Date();     
    today.setTime( today.getTime() );     
    if (expires){         
        expires = expires * 1000 * 60 * 60 * 24;     
    }     
    var expires_date = new Date( today.getTime() + (expires) );
	var c = name+'='+ value;  
	c+=(expires?';expires='+expires_date.toGMTString():'');
	c+=(path?';path='+path:';path=/');
	c+=(domain?';domain='+domain:'');
	c+=(secure?';secure':'');
	document.cookie=c;    
}  

//	根据cookie名称删除对应的cookie值
//	参数:	name cookie名
//	返回:	无
function deleteCookie(name){
    if(getCookie(name)){
        var exp = new Date();    
        exp.setTime (exp.getTime() - 1);   
        var value = getCookie(name);    
        document.cookie = name + "=" + value + "; expires=" + exp.toGMTString() + "; path=/"; 
    }
} 