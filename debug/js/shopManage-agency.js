$(function() {
	var ifNull = false, isTimeRight = false;
	var shopId = session.shopAgency_shopId;
	var marketName = session.shopAgency_marketName;
	$("#shopId").html(shopId);
	$("#marketName").html(marketName);
	// 时间控件
	$('.form-datetime').datetimepicker({
		weekStart: 1,
		todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0
	});

	formControl();

	// 检验门店电话
	$("#tel").blur(function() {
		checkTel($(this));
	});

	// 点击“提交”按钮
	$(".btn-submit").click(function() {
		ifNull = false;
		// 首先确保数据都输入了
		$(".form-group.required input, .form-group.required select, .form-group.required textarea").each(function() {
			if (!checkFormNull($(this))) ifNull = true;
		});
		// 确保输入的数据都有效
		if (!checkTime($("#startTime")) || ifNull) { return; }
		alert("ok");
	});

	$(".btn-back").click(function() {});

	// 检验门店营业时间是否正确
	function checkTime(checkObj) {
		var $formBlock = $(checkObj).parents(".form-group");
		// 如果当前输入框已有其他提示信息，退出
		if ($formBlock.hasClass("has-warning") || $formBlock.hasClass("has-error")) {
			return false;
		}
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		// 如果关门时间早于开门时间，报错
		if (endTime <= startTime) {
			var tipsText = $(checkObj).parents(".form-group").find(".control-label span").html();
			$(checkObj).parents(".form-group").addClass("has-error").append('<div class="col-sm-3 alert alert-danger">您的营业结束时间早于营业开始时间</div>');
			return false;
		}
		else return true;
	}
});
