(function(){
	/*——————————————————————————————————定义一些初始化变量——————————————————————————————————————*/
	let EDITLIST=[];  			//存储编辑区的对象属性
	let INIT_CONTENT_INDEX=0;	//存储编辑区的字体或者图片的初始化INDEX
	let WORK={};				//存储工程

	/*——————————————————————————————————定义五种字体类型————————————————————————————————————————*/
	const EDIT_WIDTH=parseFloat($('#js_editBox').width());
	const EDIT_HEIGHT=parseFloat($('#js_editBox').height());
	const FONT_LIST=[
	{
		type:'font1',
		textAlign:'center',
		fontFamily:'微软雅黑',
		fontSize:'48px',
		fontStyle:'normal',
		fontWeight:'bold',
		textDecoration:'none',
		color:'#fff',
		opacity:1,
		lineHeight:1.5,
		height:72,
		width:EDIT_WIDTH,
		left:0,
	    top:EDIT_HEIGHT*0.5,
	    marginTop:-32,
		letterSpacing:'0px',
		cssName:'font font1',
		text:'大标题',
		active:false,
		contenteditable:false
	},{
		type:'font2',
		textAlign:'center',
		fontFamily:'微软雅黑',
		fontSize:'30px',
		fontStyle:'normal',
		fontWeight:'bold',
		textDecoration:'none',
		color:'#fff',
		opacity:0.8,
		lineHeight:1.3,
		height:39,
		marginTop:-19.5,
		width:EDIT_WIDTH,
		left:0,
	    top:EDIT_HEIGHT*0.5,
		letterSpacing:'0px',
		cssName:'font font2',
		text:'标题',
		active:false,
		contenteditable:false
	},{
		type:'font3',
		textAlign:'center',
		fontFamily:'微软雅黑',
		fontSize:'20px',
		fontStyle:'normal',
		fontWeight:'normal',
		textDecoration:'none',
		color:'#fff',
		opacity:1,
		lineHeight:1.8,
		height:36,
		marginTop:-18,
		width:EDIT_WIDTH,
		left:0,
	    top:EDIT_HEIGHT*0.5,
		letterSpacing:'0px',
		cssName:'font font3',
		text:'副标题',
		active:false,
		contenteditable:false
	},{
		type:'font4',
		textAlign:'center',
		fontFamily:'微软雅黑',
		fontSize:'18px',
		fontStyle:'italic',
		fontWeight:'normal',
		textDecoration:'underline',
		color:'#fff',
		opacity:1,
		lineHeight:1.6,
		height:26,
		marginTop:-13,
		width:EDIT_WIDTH,
		left:0,
	    top:EDIT_HEIGHT*0.5,
		letterSpacing:'0px',
		cssName:'font font4',
		text:'小标题',
		active:false,
		contenteditable:false
	},{
		type:'font5',
		textAlign:'center',
		fontFamily:'宋体',
		fontSize:'14px',
		fontStyle:'normal',
		fontWeight:'normal',
		textDecoration:'none',
		color:'#fff',
		opacity:1,
		lineHeight:1.8,
		height:23,
		marginTop:-11.5,
		width:EDIT_WIDTH,
		left:0,
	    top:EDIT_HEIGHT*0.5,
		letterSpacing:'0px',
		cssName:'font font5',
		text:'正文内容',
		active:false,
		contenteditable:false
	}];
	/*——————————————————————————————————定义获取不重复的ID——————————————————————————————————————*/
	const GenNonDuplicateID=function(randomLength){
	    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36);
	};
	/*——————————————————————————————————通过type获取单独的font属性———————————————————————————————*/
	const GetFontByType=function(type){
		let obj=null;
		$.each(FONT_LIST,function(index,item){
			if(item.type===type){
				return obj=JSON.stringify(item);
			}
		});
		return JSON.parse(obj);
	};

	const GetImagesByType=function(scale,src){
		let obj=null;

		obj=JSON.stringify({
			type:'images',
			url:src,
			scale:scale,
			left:0,
			width:EDIT_WIDTH,
			height:parseFloat((EDIT_WIDTH/scale).toFixed(2)),
			top:EDIT_HEIGHT*0.5,
			marginTop:-(EDIT_WIDTH/(scale*2)),
			opacity:1,
			rotate:0,
			borderRadius:0,
			active:false
		});
		return JSON.parse(obj);
	};
	
	/*——————————————————————————————————操作EDITLIST编辑区数组————————————————————————————————————*/
	const OperateEditArray={
		addEditList:function(attr){
			INIT_CONTENT_INDEX++;
			if(EDITLIST.length!==0){
				EDITLIST.map(item=>item.active=false);
			}
			attr.active=true;
			attr.zIndex=INIT_CONTENT_INDEX;
			
			EDITLIST.push(attr);
			Observer.trigger('editData',EDITLIST); 
		},
		updateEditList:function(id,attr){
			EDITLIST.map(item =>{
				if(item.id === id){
					$.extend(item,attr)
				}
			});
			Observer.trigger('editData',EDITLIST); 
		},
		changEditListActive:function(id){
			if(EDITLIST.length!==0){
				EDITLIST.map(item=>item.active=false);
				EDITLIST.map(item =>{
					if(item.id === id){
						item.active=true;
					}
				});
				Observer.trigger('editData',EDITLIST);
			}
		},
		changEditListContenteditableTrue:function(id){
			if(EDITLIST.length!==0){
				EDITLIST.map(item=>item.active=false);
				EDITLIST.map(item =>{
					if(item.id === id){
						item.contenteditable='plaintext-only'; 
					}
				});
				Observer.trigger('editData',EDITLIST);
			}
		},
		changEditListContenteditableFalse:function(id){
			if(EDITLIST.length!==0){
				EDITLIST.map(item=>item.active=false);
				EDITLIST.map(item =>{
					if(item.id === id){
						item.contenteditable='false'; 
					}
					else if(id===''){
						item.contenteditable='false'; 
					}
				});
				Observer.trigger('editData',EDITLIST);
			}
		},
		getEditList:function(id){
			var obj=null;
			EDITLIST.map(item =>{
				if(item.id === id){
					obj=item;
				}
			});
			return obj;
		},
		removeEditList:function(id){
			
		}
	}

	/*——————————————————————————————————发布订阅模式———————————————————————————————————————————————*/
	const Observer=(function(){
	    var clientList={},
	        listen,
	        remove,
	        trigger;

	    listen=function(key,fn){
	        if(!clientList[key]){
	            clientList[key]=[];
	        }
	        clientList[key].push(fn);
	    };
	    trigger=function(){
	        var key=Array.prototype.shift.call(arguments);
	        var fns=clientList[key];
	        if(!fns || fns.length===0){
	            return false;
	        }else{
	            for(var i=0,fn;fn=fns[i++];){
	                fn.apply(this,arguments);
	            }
	        }
	    };
	    remove=function(key,fn){
	        var fns=clientList[key];
	        if(!fns){
	            return false;
	        }
	        if(!fn){
	            fns && (fns.length=0);
	        }else{
	            for(var l=fns.length-1;l>=0;l--) {
	                
	                var _fn=fns[l];
	                if(_fn===fn){
	                    fns.splice(l,1);
	                }
	            }
	        }
	    };

	    return {
	        listen:listen,
	        remove:remove,
	        trigger:trigger
	    }
	})();
	
	window.EDITLIST=EDITLIST;
	window.WORK=WORK;
	window.FONT_LIST=FONT_LIST;
	window.INIT_CONTENT_INDEX=INIT_CONTENT_INDEX;
	window.GenNonDuplicateID=GenNonDuplicateID;
	window.GetFontByType=GetFontByType;
	window.GetImagesByType=GetImagesByType;
	window.OperateEditArray=OperateEditArray;
	window.Observer=Observer;
})();