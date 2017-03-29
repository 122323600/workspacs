window.QueryStringParser = function(){
	var url = window.location.href ;
	var rex = /[^\x00-\xff]+/ ;
	if(rex.exec(url))url = encodeURI(url) ;  
	if(url.indexOf("?")<0) return ;        
	rex = /&(?![\w]+;)/
	url = url.substr(url.indexOf("?")) ;
	var params = url.split (rex) ;
	rex = /([\w_]+)=([\x00-\xFF]*)$/    
	for(var i=0;i<params.length;i++) {
		var m = rex.exec(params[i])  ;        
		this[m[1]] = decodeURI(m[2]) ;
	}
	if(this["_pre"])window.location.previousPage = this["_pre"] ;    
	this.toString = function(){
		var s = "" ;       
		for (var o in this){
			if(typeof(this[o])!="string"  )  continue ;
			s += "&" + o + "=" + this[o]  ;
		}
		if(s.length>0) s = s.substr(1) + "&" ;
		s += "_pre=" + window.location.href.substr(0,window.location.href.indexOf("?")) ;
		return s ;
	}              
}
window.QueryStringParser.prototype.getTypeName = function(){
	return "QeryStringParser" ;
} 
window.QueryStringParser.prototype.getParam = function(name){
	if(typeof(this[name])=="undefined") return "" ;
	return this[name] ; 
} 