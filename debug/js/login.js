$(function(){
	plumeLog("进入login模板自定义js-"+plumeTime());
	$(".login-btn").bind("click",function(){
		window.location.href="../index";
	});
	$(".reg-btn").bind("click",function(){
		window.location.href="../index?fullscreen";
	});
	$(".login-head-btn .btn1").bind("click",function(){
		$(".reg-block").fadeOut();
		$(".login-block").fadeIn();
	});
	$(".login-head-btn .btn2").bind("click",function(){
		$(".login-block").fadeOut();
		$(".reg-block").fadeIn();
	});
});
