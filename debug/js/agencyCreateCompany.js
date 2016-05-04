var thisUrl = "agencyCreateCompany";

$(function() {
	// 选择日期
	$('#startTime').cxCalendar();
	$("#endTime").cxCalendar();


	// 点击“下一步”，提交表单
	$(".btn-next").on("click", function() {
		derict(this, "agencyAddAccount", "nochangeurl");
		// $(".work-space").loadTemp("agencyAddAccount","nochangeurl");
		// $("#addAccount").on("click", ".back", function() {
		// 	alert("back");
		// 	$(".work-space").loadTemp("agencyCreateCompany","nochangeurl");
		// });
	});
	// 点击“取消”，返回至列表页
	$(".btn-back").on("click", function() {
		$(".work-space").loadTemp("agencyList","nochangeurl");
	});


	// 点击“上传”，上传资料图片，并显示
	$(".btn-onload").on("click", function() {
		$(this).parents(".form-group").append('<div class="col-sm-2"><div class="media" onclick="showBigImage(this)"><img src="images/temp/default.jpg" /></div><span class="btn btn-link btn-link-delete" onclick="deleteInfo(this)">删除</span></div>');
	});
});

// 删除上传的资料图片并删除大图显示
function deleteInfo(deleteObj) {
	$(".form-loading .media-show").remove();
	$(deleteObj).parents(".col-sm-2").remove();
}

// 点击上传的资料图片，在右侧显示大图
function showBigImage(showObj) {
	var imgSrc = $(showObj).find("img").attr("src");
	console.log(imgSrc);
	$(".form-loading").prepend('<div class="media-show"><span class="btn btn-close" onclick="closeBigImage()"></span><img src="' + imgSrc + '"></div>');
}

// 关闭大图显示
function closeBigImage() {
	$(".form-loading .media-show").remove();
}

function turnBack() {
	alert("BACK!!");
	$(".back").bind("click", function() {
		alert("NOWBACK");
		$(".work-space").loadTemp("agencyCreateCompany","nochangeurl");
	});
	// $("#addAccount").on("click", ".back", function() {
	// 	alert("back");
	// 	$(".work-space").loadTemp("agencyCreateCompany","nochangeurl");
	// });
}