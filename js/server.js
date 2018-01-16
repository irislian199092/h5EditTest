$(function(){
	const serverUrl='http://10.7.4.110:8080/kaka';
	$.ajaxSetup({
	  	dataType : "json",
	  	error:function(XMLHttpRequest, textStatus, errorThrown){
	  		console.log('失败XMLHttpRequest',XMLHttpRequest);
	  		console.log('失败XMLHttpRequest',textStatus);
	  		console.log('失败XMLHttpRequest',errorThrown);
	  	}
	});
	//初始化打开work
	$.ajax({
		url:serverUrl+'/api/works/pages',
		type: "GET",
		data:{
			"workid":'affdlk',
		},
		success:function(msg){
			if(msg.code===0&&msg.data!==null){
				console.log('---')
				//WORK=msg.data.list;
				Observer.trigger('getWorkList',msg.data);
			}else{
				console.log('error');
			}
		}
	});
	//初始化获取素材列表
	$.ajax({
		url:serverUrl+'/api/picture',
		type: "GET",
		data:{
			"currentPage":1,
			"pageSize":3
		},
		success:function(msg){
			if(msg.code===0&&msg.data!==null){
				console.log('---')
				Observer.trigger('getImagesList',msg.data);
			}else{
				console.log('error');
			}
		}
	});

	//监听work列表
	Observer.listen('getWorkList',function(data){
		WORK=data;
		if(WORK.length!==0){
			//开始渲染页面
		}else{
			//初始化渲染页面

		}
	});
	//监听素材列表
	Observer.listen('getImagesList',function(){

	});

	$('#uploadForm input[type="file"]').on('change',doUpload);

	function doUpload(){
		var formData = new FormData($("#uploadForm")[0]);
		console.log('formData',formData)
		$.ajax({
			url:'http://10.7.4.110:8080/kaka/api/picture/upload',
			type:'POST',
			data:formData,
			dataType:'json',
			async:false,
			cache:false,
			contentType:false,
			processData:false,
			sucess:function(msg){
				console.log(msg);
			},
			error:function(msg){
				console.log(msg);
			}
		});
	}
});