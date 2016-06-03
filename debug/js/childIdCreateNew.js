//是否是添加
var isAdd = 1;
//修改子账号
var modifyAcId = sessionStorage.modifyAcId;

//手机号是否存在
var mobileExist = 1;

//权限
var roleCodes = "";

// ifPhoneSuccess: 判断手机号码是否合格, ifPasswordSuccess: 判断密码是否合格
var ifPhoneSuccess = false, ifPasswordSuccess = false;

$(function () {
    plumeLog("进入childIdCreate模板自定义js-" + plumeTime());

    // 绑定表单输入框验证不为空事件
    formControl();

    // 点击“取消”按钮，返回上一页
    $(".btn-back").bind("click", function () {
        derict(this, "idmanage", "nochangeurl");
    });

    // 点击“提交”按钮
    $(".btn-next").bind("click", function() {
    	if(isAdd == 1) subAccAdd();
    	else subAccModify();
    });

    //权限设置
    $(".btn-myset").bind("click",function(){
        $('.pop').loadTemp("popAuth", "nochangeurl", function () {
        // $(".cic-pop").pop("popAuth",function(){
            rolesShow();

            if(isAdd == 0)
                getAccRole(modifyAcId);
            
            //权限配置弹出框 -- 取消
            $(".pa-cancel").bind("click",function(){
                $(".pop").pophide();
                // $(".cic-pop").pophide();
            });
            //权限配置弹出框 -- 确认
            $(".btn-success").bind("click", function() {
                roleCodes = "";
                $("input[name='rolebox']:checked").each(function(){
                    roleCodes = roleCodes.concat($(this).val()).concat(",");
                });
                $(".pop").pophide();

                // $(".cic-pop").pophide();
            });
        });
    });

    // 检验手机号码
	function checkPhone(checkObj) {
		// 清除可能存在的提示信息
		$(checkObj).parents(".form-group").removeClass("has-warning").removeClass("has-error").find(".alert").remove();
		ifPhoneSuccess = false;
		// 首先判断是否为空
		if (checkFormNull($(checkObj))) {
			var phone = $(checkObj).val().trim();
			// 其次判断是否符合手机号规则
			if (!isMobile(phone)) {
				$(checkObj).parents(".form-group").addClass("has-error").append('<div class="col-sm-2 alert alert-danger">手机号码不正确</div>');
				return;
			}
			// 最后判断手机号是否已经存在
			checkPhoneExist(phone);
        }
	}

	//判断手机号是否已存在
	function checkPhoneExist(phone){
		// 清除可能存在的提示信息
		$("#tel").parents(".form-group").removeClass("has-warning").removeClass("has-error").find(".alert").remove();
		$.ajax({
			type: "get",
			url: plumeApi["getUserInfoByMobile"] + phone,
			contentType: "application/json",
			dataType: "json",
			success: function (data) {
				// // 清除可能存在的提示信息
				// $($("#tel")).parents(".form-group").removeClass("has-warning").removeClass("has-error").find(".alert").remove();
				if (data.ok) {
					ifPhoneSuccess = true;
				}
				else if (data.data == null) {
					ifPhoneSuccess = false;
					$("#tel").parents(".form-group").addClass("has-error").append('<div class="col-sm-2 alert alert-danger">手机号码是否存在检查异常</div>');
				}
				else if(data.data > 0) {
					ifPhoneSuccess = false;
					$("#tel").parents(".form-group").addClass("has-error").append('<div class="col-sm-2 alert alert-danger">手机号码已经存在</div>');
				}
				else {
					ifPhoneSuccess = false;
					$("#tel").parents(".form-group").addClass("has-error").append('<div class="col-sm-2 alert alert-danger">手机号码检查接口返回值不能识别</div>');
				}
			}
		});
	}

	// 检验密码/确认密码
	function checkPassword(checkObj) {
		// 清除可能存在的两次输入密码不一致的提示框
		$("#repwd").parents(".form-group").removeClass("has-error").find(".alert-danger").remove();
		ifPasswordSuccess = false;
		// 首先判断是否为空
		if (checkFormNull($(checkObj))) {
			var password = $(checkObj).val();
			// 其次判断是否符合密码规范
			if (!pwdCheck(password)) {
				$(checkObj).parents(".form-group").addClass("has-warning").append('<div class="col-sm-2 alert alert-info">请输入6-15位数字或字母组合</div>');
				return;
			}
			// 最后检验两次输入的密码是否一致
			if ($("#repwd").val().trim() != "") {
				checkPasswordSame();
			}
		}
	}

	// 检验两次输入的密码是否一致
	function checkPasswordSame() {
		// 清除确认密码可能存在的提示信息
		$("#repwd").parents(".form-group").removeClass("has-warning").removeClass("has-error").find(".alert").remove();
		var password = $("#pwd").val();
		var rePassword = $("#repwd").val();
		if (password == rePassword) {
			ifPasswordSuccess = true;
		}
		else {
			ifPasswordSuccess = false;
			$("#repwd").parents(".form-group").addClass("has-error").append('<div class="col-sm-2 alert alert-danger">密码和确认密码不一致</div>');
		}
	}

    // "手机号码"输入框失去焦点
    // -------------------------------------------------------
    $("#tel").blur(function() {
    	checkPhone($(this));
    });

	// "密码/确认密码"输入框失去焦点
	// -------------------------------------------------------
	$("#pwd, #repwd").blur(function() {
		checkPassword($(this));
	});
    
    //把session中的修改子账号id删除
    sessionStorage.removeItem("modifyAcId");

    if (modifyAcId && modifyAcId != '') {
        isAdd = 0;      //修改时
        $(".title-block").html("修改子账号");
    } else {
        modifyAcId = sessionStorage.login_id;   //添加
    }

    subAccUpView(modifyAcId);
});

//获取此账号已经有的配置权限
function getAccRole(accountId) {
    $.ajax({
        url: plumeApi["listUserRole"] + "?id="+accountId,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        success: function (data) {
            if (data.ok) {
                var roles = JSON.stringify(data.data);
                console.log("roles = " + roles);

                if(roles.indexOf("digital_dealer_emp") > -1) {
                    $(".digagentbox [type='checkbox']").attr("checked", "checked");
                } 

                if(roles.indexOf("digital_manu_emp") > -1) {
                    $(".digmanubox [type='checkbox']").attr("checked", "checked");
                }          
            } else {
                popTips("获取配置权限失败","warning");
                // alert("获取配置权限失败:"+data.resDescription);
            }
        }
    })
}

//判断权限哪些显示
function rolesShow() {
    console.log("userType="+sessionStorage.login_userType);
    //经销商权限 
    if(sessionStorage.login_userType == 2) {                  
        $(".digagentbox").fadeIn();
     //工厂权限    
    } else if(sessionStorage.login_userType == 1) {
        $(".digmanubox").fadeIn();     
    } 
}

//子账号修改渲染。 如果是修改，把元素赋值；如果
function subAccUpView(accountId) {
    var apiName = "";
    //判断是哪种角色
    var userType = sessionStorage.login_userType;
    if(userType == null || userType == 0) {
        return;
    } else if(userType == 1) {
        apiName = plumeApi["getManuSubUserUpView"];
    } else if (userType == 2) {
        apiName = plumeApi["getAgentsSubUserUpView"];
    } else {
        return;
    }

    $.ajax({
        url: apiName + "?id="+accountId,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        success: function (data) {
            if (data.ok) {
                console.log("subAccUpView accountId="+accountId);
                console.log("subAccUpView data="+JSON.stringify(data.data));

                var mobilePhone = data.data.mobilePhone;
                var remark = data.data.remark;

                //编辑状态时，手机号、密码不能修改。
                if(isAdd == 0) {
                    $("#tel").val(mobilePhone);
                    $("#remark").val(remark);

                    $("#tel").attr("disabled","disabled");
                    $("#pwd").attr("disabled","disabled");
                    $("#repwd").attr("disabled","disabled");
                }

                //供销商
                if(sessionStorage.login_userType == 2) {
                    var shopId = data.data.shopId == null? -1: data.data.shopId;
                    var shoplist = data.data.shoplist;

                    if(shoplist && shoplist.length > 0) {
                        var shopHtml = '';
                        // var shopHtml = '<option value="">请选择店铺...</option>';
                        for(var i=0; i<shoplist.length; i++) {
                            if(shopId == shoplist[i].id) {
                                shopHtml += "<option value='"+shoplist[i].id+"' selected='selected' >"+shoplist[i].boothCode +"</option>";
                            } else {
                                shopHtml += "<option value='"+shoplist[i].id+"'>"+shoplist[i].boothCode +"</option>";
                            }
                        }

                        $("#agentShop").html(shopHtml);
                        $(".shops").fadeIn();
                    }

                //工厂
                } else if(sessionStorage.login_userType == 1) {                    
                    //已关联品牌
                    var relationbrandstr = ":";
                    var relationbrandList = data.data.relationbrandList;
                    if(relationbrandList && relationbrandList.length > 0) {
                        for(var i=0; i<relationbrandList.length; i++) {
                            relationbrandstr = relationbrandstr.concat(relationbrandList[i]).concat(":");
                        }
                    }

                    //未关联品牌
                    var brandList = data.data.brandList;
                    if(brandList && brandList.length > 0) {
                        var brandHtml = "";
                        for(var i=0; i<brandList.length; i++) {
                            brandHtml += "<label class='checkbox-inline'>";
                            brandHtml += "<input type='checkbox' name='brands'  value='"+brandList[i].id+"'";
                            if(relationbrandstr.indexOf(":"+brandList[i].id+":") > -1) {
                                brandHtml += " checked='checked'";
                            } 
                            brandHtml += " />";
                            brandHtml += brandList[i].brandName;
                            brandHtml += '</label>';
                        }
                        $(".manuBrand").html(brandHtml);
                        $(".brands").fadeIn();
                    }
                }

            }
            else {
                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                    $(".pop").find(".popup-title").html("添加失败");
                    $(".pop").find(".popup-icon").html('<i class="warning"></i>');
                    $(".pop").find(".popup-info").html(data.resDescription);
                });
                // popTips("添加失败","warning");
                // alert("添加失败:"+data.resDescription);
            }
        }
    });
}

//子账号编辑
function subAccModify() {
    var remark = $("#remark").val();

    //参数字符串
    var paramData = "";
    var apiName = "";

    // 获取登录人的用户类型：0：未设定,1:工厂,2:经销商代理商
    var userType = sessionStorage.login_userType;
    // 工厂角色
    if(userType == 1) {
    	// 首先确保必须选择一个关联品牌
    	var flag_brand = false, brandIds = "";
    	$("input[name='brands']:checked").each(function() {
    		flag_brand = true;
    		brandIds = brandIds.concat($(this).val()).concat(",");
    	});
    	if (!flag_brand) {
    		$('.pop').loadTemp("popTips", "nochangeurl", function () {
    			$(".pop").find(".popup-title").html('提交失败');
    			$(".pop").find(".popup-icon").html('<i class="warning"></i>');
    			$(".pop").find(".popup-info").html("请至少选择一个关联品牌！");
    		});
    		return;
    	}

    	apiName = plumeApi["editManuSubUserInfo"];

    	paramData = JSON.stringify({
    		"id": modifyAcId,
    		"remark": remark,
    		"brandIds": brandIds,
    		"roleCodes": roleCodes
    	});
    }
    // 经代商角色
    else if (userType == 2) {
    	// 获取经代商所属店铺
    	var shopId = $("#agentShop").val();

    	apiName = plumeApi["editAgentsSubUserInfo"];
    	paramData = JSON.stringify({
    		"id": modifyAcId,
    		"remark": remark,
    		"shopId": shopId,
    		"roleCodes": roleCodes
    	});
    }
    else {
        return;
    }

    console.log("subAccModify paramData="+paramData);

    //修改请求
    loading();
    $.ajax({
        url: apiName,
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        data: paramData,
        success: function (data) {
            unloading();
            if (data.ok) {
                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                    $(".pop").find(".popup-title").html('修改成功');
                    $(".pop").find(".popup-icon").html('<i class="success"></i>');
                    $(".pop").find(".popup-info").html("子账号修改成功");
                });
                derict(this, "idmanage", "nochangeurl");
            } else {
                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                    $(".pop").find(".popup-title").html('修改失败');
                    $(".pop").find(".popup-icon").html('<i class="warning"></i>');
                    $(".pop").find(".popup-info").html(data.resDescription);
                });
            }
        }
    });
}

//子账号添加
function subAccAdd() {
	// 首先确保数据都输入了
	$(".form-group.required input, .form-group.required textarea").each(function() {
		checkFormNull($(this));
	});
	// 确保输入的数据都有效
	if (!ifPhoneSuccess || !ifPasswordSuccess) { return; }
	
    var tel = $("#tel").val();
    var pwd = $("#pwd").val();
    var repwd = $("#repwd").val();
    var remark = $("#remark").val();

    //参数字符串
    var paramData = "";

    var apiName = "";

    // 获取登录人的用户类型：0：未设定,1:工厂,2:经销商代理商
    var userType = sessionStorage.login_userType;
    // 工厂角色
    if(userType == 1) {
    	// 首先确保必须选择一个关联品牌
    	var flag_brand = false, brandIds = "";
    	$("input[name='brands']:checked").each(function() {
    		flag_brand = true;
    		brandIds = brandIds.concat($(this).val()).concat(",");
    	});
    	if (!flag_brand) {
    		$('.pop').loadTemp("popTips", "nochangeurl", function () {
    			$(".pop").find(".popup-title").html('提交失败');
    			$(".pop").find(".popup-icon").html('<i class="warning"></i>');
    			$(".pop").find(".popup-info").html("请至少选择一个关联品牌！");
    		});
    		return;
    	}
        apiName = plumeApi["addManuSubUserInfo"];

        paramData = JSON.stringify({
        	"mobilePhone": tel,
        	"password": pwd,
        	"rePassword": repwd,
        	"remark": remark,
        	"brandIds": brandIds,
        	"roleCodes": roleCodes
        });
    }
    // 经代商角色
    else if (userType == 2) {
    	// 获取经代商所属店铺
    	var shopId = $("#agentShop").val();

        apiName = plumeApi["addAgentsSubUserInfo"];

        paramData = JSON.stringify({
        	"mobilePhone": tel,
        	"password": pwd,
        	"rePassword": repwd,
        	"remark": remark,
        	"shopId": shopId,
        	"roleCodes": roleCodes
        });
    }
    else {
        return;
    }

    console.log("subAccAdd paramData="+paramData);

    //添加请求
    loading();
    $.ajax({
        url: apiName,
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        data: paramData,
        success: function (data) {
            console.log("url:" + apiName);
            console.log(paramData);
            unloading();
            if (data.ok) {
                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                    $(".pop").find(".popup-title").html("添加成功");
                    $(".pop").find(".popup-icon").html('<i class="success"></i>');
                    $(".pop").find(".popup-info").html("子账号添加成功");
                });
                derict(this, "idmanage", "nochangeurl");
            } else {
                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                    $(".pop").find(".popup-title").html("添加失败");
                    $(".pop").find(".popup-icon").html('<i class="warning"></i>');
                    $(".pop").find(".popup-info").html(data.resDescription);
                });
            }
        }
    });
}


//密码验证: 6-15位字符，建议数字和字母组合
function pwdCheck(pwd) {
    return /^[0-9A-Za-z]{6,15}$/.test(pwd);
}

//手机号验证
function isMobile(n) {
    return /^1\d{10}$/.test(n) && n != 11111111111;
}