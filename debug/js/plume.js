/**
 --基于jquery框架plume
 --刘磊
 --2015/11/04 v1.0
 --2016/01/12 v1.1
 --2016/02/26 v1.2
 --2016/04/07 v1.3
 --2016/04/20 v1.4
 **/
var configJson={};//配置文件数据集合
var ajax_urls;//配置文件中接口集合--v1.3功能较单一需扩展
var pathName=window.document.location.pathname;
var plumePath="http://"+window.document.location.host+pathName.substring(0,pathName.substr(1).lastIndexOf('/')+1);
$(function(){
	plumeLog("进入plume全局设置-"+plumeTime());
	var configurl=_PLUME.config?_PLUME.config:"";
	var initPage=_PLUME.initPage?_PLUME.initPage:"";
	var type=_PLUME.type?_PLUME.type:"";
	$.get(configurl,function(data){
		//解析配置文件
		$(data).find("page").each(function(index, element) {
			var pageName=$(this).find("page-name").text();
			var pageUrl=$(this).find("page-url").text();
			var init=$(this).find("init").text();
			var temp={};
			temp["pageUrl"]=plumePath+pageUrl;
			temp["init"]=init;
			configJson[pageName]=temp;
		});
		ajax_urls=$(data).find("ajax-urls");
		var page_init=$(data).find("index-init").text();
		try{
			plumeLog("执行全局初始化函数-"+plumeTime());
			eval(page_init+"()");
		}catch(e){
			plumeLog("无全局初始化函数-"+plumeTime());
		}
		if(type=="index"){
			$.toUrl(initPage,false);
		}else{
			$("[list-temp]").hide();
			var init=configJson[initPage]["init"];
			eval(init+"()");
		}
	});
})
//dom级别功能组件,plume内部方法
$.fn.extend({
	loadHtml:function(url,fun,cache){
		var _this=this;
		try{
			if(window.sessionStorage&&cache){
				if(window.sessionStorage[url]){
					loadHtmlFuncs.createHtml(_this,window.sessionStorage[url],fun);
				}else{
					try{
						$$.ajax({ url: url,async:false, success: function(data){
							var data_str=data.substring(data.indexOf("<body>"),data.indexOf("</body>")+7);
							window.sessionStorage[url]=data_str;
							loadHtmlFuncs.createHtml(_this,data_str,fun);
						}});
						return;
						$$.get(url,{},function(data){
							var data_str=data.substring(data.indexOf("<body>"),data.indexOf("</body>")+7);
							window.sessionStorage[url]=data_str;
							loadHtmlFuncs.createHtml(_this,data_str,fun);
						})
					}catch(e){
						plumeLog("提示:"+e.message);
					}
				}
			}else{
				try{
					$$.ajax({ url: url,async:false, success: function(data){
						var data_str=data.substring(data.indexOf("<body>"),data.indexOf("</body>")+7);
						loadHtmlFuncs.createHtml(_this,data_str,fun);
					}});
					return;
					$$.get(url,{},function(data){
						var data_str=data.substring(data.indexOf("<body>"),data.indexOf("</body>")+7);
						loadHtmlFuncs.createHtml(_this,data_str,fun);
					})
				}catch(e){
					plumeLog("提示:"+e.message);
				}
			}
		}catch(e){
			plumeLog("提示:"+e.message);
		}
	}
})
//plume内部方法
var loadHtmlFuncs={
	//容器载入模板code
	createHtml:function(obj,data,fun){
		try{
			/*$(obj).fadeOut(function(){
				$(this).html("");
				$(this).html(data);
				$("[list-temp]").hide();
				$(this).fadeIn(function(){
					try{
						if(fun){
							fun();
						}
					}catch(e){
						plumeLog("提示:"+e.message);
					}
				});
			})*/
			$(obj).hide().html("");
			$(obj).html(data);
			$("[list-temp]").hide();
			$(obj).show();
			try{
				if(fun){
					fun();
				}
			}catch(e){
				plumeLog("提示:"+e.message);
			}
		}catch(e){
			plumeLog("提示:"+e.message);
		}
	}
}
//document级别组件
/*开放API:
1.toUrl:v1.0之后加入,推荐使用
 */
$.extend({
	//开放方法,页面级别跳转,涉及路由变化.动态参数,name:模板名称,flag:cache,nochangeurl标识,fun 回调函数
	toUrl:function(){
		var args=arguments;
		var name,flag,fun;
		if(args.length==0){
			plumeLog("提示:loadUrl未传参");
			return;
		}
		if(args.length==1){
			name=args[0];
		}
		if(args.length==2){
			name=args[0];
			if(typeof(args[1])=="function"){
				fun=args[1];
			}else{
				flag=args[1];
			}
		}
		if(args.length==3){
			name=args[0];
			flag=args[1];
			fun=args[2];
		}
		var prams="";
		if(name.indexOf("?")!=-1){
			prams=name.substring(name.indexOf("?"));
			name=name.substring(0,name.indexOf("?"));

		}
		plumeLog(name+"--"+prams)
		var dom=document.body;
		$(dom).find("*").unbind()
		if(!flag){flag=""}
		var cache=(flag.indexOf("cache")==-1)?false:true;
		$.loadUrlData(name,cache,dom);
		var url=$.getUrlByName(name)+prams;
		if(flag.indexOf("nochangeurl")==-1){
			try{window.history.pushState({},0,url)}catch(e){plumeLog("提示:无法动态改变地址:"+e.message);}
		}
		try{
			if(fun){
				fun();
			}
		}catch(e){
			plumeLog("提示:"+e.message);
		}
	},
	//内部方法,通过模板名称获取模板路径
	getUrlByName:function(name){
		try{return configJson[name]["pageUrl"];}catch(e){plumeLog("提示:未找到加载模板路径:"+e.message);}
	},
	//内部方法,获取模板内容(code)
	loadUrlData:function(name,cache,dom){
		var init=configJson[name]["init"];
		var url=$.getUrlByName(name);
		$(dom).loadHtml(url,function(){
			try{
				eval(init+"()");
			}catch(e){
				plumeLog("提示:"+e.message);
			}
		},cache)
	},
	//内部方法,浏览器back键或其他回退方式执行的方法
	plumeBack:function(url){
		if(url.indexOf("?")!=-1){
			url=url.substring(0,url.indexof("?"));
		}
		for(key in configJson){
			plumeLog(configJson[key]["pageUrl"]);
			if(url.indexOf(configJson[key]["pageUrl"])!=-1){
				$.loadUrlData(key,false,document.body);
				break;
			}
		}
	},
	//ajax重写post,v1.3未开发
	loadPostData:function(url,pram,fun){

	},
	//ajax重写get,v1.3未开发
	loadGetData:function(url,pram,fun){

	}
});
//dom级功能组件
/*开放API:
1.loadTemp v1.3之后加入,推荐使用
2.setPageData v1.0之后加入,不推荐使用,功能未定型
 */
$.fn.extend({
	//开放方法,dom级别加载,不涉及路由变化.动态参数,name:模板名称,flag:cache,nochangeurl标识,fun 回调函数
	loadTemp:function(){
		var args=arguments;
		var name,flag,fun;
		if(args.length==0){
			plumeLog("提示:loadUrl未传参");
			return;
		}
		if(args.length==1){
			name=args[0];
		}
		if(args.length==2){
			name=args[0];
			if(typeof(args[1])=="function"){
				fun=args[1];
			}else{
				flag=args[1];
			}
		}
		if(args.length==3){
			name=args[0];
			flag=args[1];
			fun=args[2];
		}
		var dom=this;
		var prams="";
		if(name.indexOf("?")!=-1){
			prams=name.substring(name.indexOf("?"));
			name=name.substring(0,name.indexOf("?"));

		}
		$(dom).find("*").unbind()
		if(!flag){flag=""}
		var cache=(flag.indexOf("cache")==-1)?false:true;
		$.loadUrlData(name,cache,dom);
		var url=$.getUrlByName(name)+prams;
		if(flag.indexOf("nochangeurl")==-1){
			try{window.history.pushState({},0,url)}catch(e){plumeLog("提示:无法动态改变地址:"+e.message);}
		}
		try{
			if(fun){
				fun();
			}
		}catch(e){
			plumeLog("提示:"+e.message);
		}
	},
	//内部方法,dom级别绑定赋值
	setNodeData:function(dataname,data,nodename){
		eval("var "+dataname+"=data");
		var tags=($(this).attr(nodename)).split(",");
		var tagName=$(this)[0].tagName;
		for(var i=0;i<tags.length;i++){
			tag=tags[i];
			if(tag.indexOf("attr-")!=-1){
				$(this).attr(tag.substring(5,tag.indexOf(":")),eval(tag.substring(tag.indexOf(":")+1)))
			}else{
				if(tagName=="INPUT"||tagName=="TEXTAREA"||tagName=="SELECT"){
					$(this).val(eval(tag));
				}else if(tagName=="IMG"){
					$(this).attr("src",eval(tag));
				}else if(tagName=="A"){
					if(tag.indexOf("tel:")==-1){
						$(this).attr("href",eval(tag));
					}else{
						$(this).attr("href","tel:"+eval(tag.substring(4)));
					}
				}else{
					if(tag.indexOf("bg:")!=-1){
						$(this).css({"backgroundImage":"url("+(eval(tag.substring(3))+")")});
					}else if(tag.indexOf("html:")!=-1){
						$(this).html(eval(tag));
					}else{
						$(this).text(eval(tag));
					}
				}
			}
		}
	},
	//开放方法,dom级别绑定赋值,仅作为扩展思路,功能较弱,不推荐使用
	setPageData:function($p){
		$(this).find("[data-name]").each(function(i,e){
			$(this).setNodeData("$p",$p,"data-name");
		});
		$(this).find("[data-list]").each(function(x, e) {
			var listTag=$(this).attr("data-list");
			var listObj=$(this);
			var temp=$(this).find("[list-temp]").prop("outerHTML");
			temp=temp.replace("list-temp","list-node");
			var listData=eval(listTag);
			for(var i=0;i<listData.length;i++){
				$(temp).appendTo(listObj).show();
				var dataListNode=$(this).find("[list-node]:last");
				$n=listData[i];
				$(dataListNode).find("[node-name]").each(function(x,e){
					$(this).setNodeData("$n",$n,"node-name");
				});
			}
			var b=new Date().getTime();
			plumeLog(b);
		});
	}
});
//内部方法,重写浏览器回退,前进,刷新事件,使用setTimeout为了避免部分浏览器bug,保证兼容
setTimeout(function(){
	$(window).on('popstate', function() {
		$.plumeBack(window.document.location.href);
	});
},1000);
//plume工具类
/*开放API
1.css:动态加载css,加载即可用
2.js:动态加载js,加载即可用
 */
var plumeUtil = {
	css: function(path) {
		if (!path || path.length === 0) {
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.href = path;
		link.rel = 'stylesheet';
		link.type = 'text/css';
		head.appendChild(link);
	},
	js: function(path) {
		if (!path || path.length === 0) {
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = path;
		script.type = 'text/javascript';
		head.appendChild(script);
	}
}
//重写扩展jquery中ajax,提供对象$$
var $$={
	$$_monitor_start:function (){
		var t=plumeTime();
		plumeLog("--开始执行监控xhr请求:"+t);
		//plumeLog(arguments);
		return t
	},
	$$_monitor_end:function (){
		var t=plumeTime();
		plumeLog("--结束执行监控xhr请求:"+t);
		//plumeLog(arguments);
		return t
	},
	$$_monitor_time:function (url,t1,t2){
		var t=plumeTime();
		//plumeLog(arguments);
		plumeLog("--xhr请求="+url+"=共耗时:"+(t2-t1)+"毫秒");
		return t
	},
	post:function(){
		var $$_obj=this;
		var args=arguments;
		$$_obj.$$_monitor_start(args,"post");
		//可监控ajax-参数需要统一:参数1:请求url,参数2:入参,参数3:回调函数
		var callback=arguments[2];
		$.post(arguments[0],arguments[1],function(data){
			$$_obj.$$_monitor_end(args,"post");
			callback(data);
		});
		return;
		//非可监控ajax-不可用,暂时屏蔽
		if(arguments.length==1){
			$.post(arguments[0]);
		}else if(arguments.length==2){
			$.post(arguments[0],arguments[1]);
		}else if(arguments.length==3){
			$.post(arguments[0],arguments[1],arguments[2]);
		}else if(arguments.length==4){
			$.post(arguments[0],arguments[1],arguments[2],arguments[3]);
		}else{
			plumeLog("ajax传参错误");
		}
	},
	get:function(){
		var $$_obj=this;
		var args=arguments;
		var t_start=$$_obj.$$_monitor_start(args,"get");
		//可监控ajax-参数需要统一:参数1:请求url,参数2:入参,参数3:回调函数
		var callback=arguments[2];
		$.get(arguments[0],arguments[1],function(data){
			var t_end=$$_obj.$$_monitor_end(args,"get");
			$$_obj.$$_monitor_time(args[0],t_start,t_end);
			callback(data);
		});
		return;
		//非可监控ajax-不可用,暂时屏蔽
		if(arguments.length==1){
			$.get(arguments[0]);
		}else if(arguments.length==2){
			$.get(arguments[0],arguments[1]);
		}else if(arguments.length==3){
			$.get(arguments[0],arguments[1],arguments[2]);
		}else if(arguments.length==4){
			$.get(arguments[0],arguments[1],arguments[2],arguments[3]);
		}else{
			plumeLog("ajax传参错误");
		}
	},
	ajax:function(){
		this.$$_monitor_start(arguments);
		//非可监控ajax
		if(arguments.length==1){
			$.ajax(arguments[0]);
		}else if(arguments.length==2){
			$.ajax(arguments[0],arguments[1]);
		}else{
			plumeLog("ajax传参错误");
		}
	}
};
//内部测试方法,获取时间戳
function plumeTime(){
	return new Date().getTime();
}
//内部测试方法,打印日志
function plumeLog(o){
	console.log(o);
}