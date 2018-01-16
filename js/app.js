$(function(){
/*------------------------------------------切换Tab页---------------------------------------------*/
$('#js_tab_bar_text').on('click',function(){
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
	$('#js_tab_text').show();
	$('#js_tab_text').siblings().hide();
});
$('#js_tab_bar_upload').on('click',function(){
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
	$('#js_tab_upload').show();
	$('#js_tab_upload').siblings().hide();
});
//初始化编辑区居中
//$('#js_middleContext .editBox').css('margin-left',-$('.editBox').width()/2);
$('#js_middleContext .editBox_tool').css('left',$('.editBox').position().left+$('.editBox').width()/2+30);
/*------------------------------------------获取图片---------------------------------------------*/


$('#js_material_box img').on('mouseover',function(){
	$(this).parent().addClass('active');
	$(this).parent().siblings().removeClass('active');
}).on('mouseout',function(){
	$(this).parent().removeClass('active');
});

/*------------------------------------------渲染Text列表------------------------------------------*/

FONT_LIST.forEach(function(item,index){
	var list=$('<div class="'+item.cssName+'" data-type="'+item.type+'" >'+item.text+'</div>');

	for (let key in item) {
		list[0].style[key]=item[key];
	}
	$('#js_tab_text').append(list);
});
/*------------------------------------------渲染Images列表------------------------------------------*/


/*------------------------------------------添加点击事件------------------------------------------*/
(function(win,doc,$){

    function ClickObj(options){
        this._init(options);
    };
    $.extend(ClickObj.prototype,{
        //初始化函数
        _init:function(options){
            var self=this;
            self.options={
                type:'', 
                cont:''
            }
            $.extend(true,self.options,options||{});

            self._initDom();
            return self;
        },
        _initDom:function(){
        	var self=this;
        	self.$cont=self.options.cont;
        	self.$type=self.options.type;
        	self.$doc=$(doc);
        	if(this.$type===''){
                throw new Error('您必须输入点击的素材类型')
            }
            if(this.$cont===''){
                throw new Error('您必须输入点击的对象')
            }
            if(this.$type==='text'){
                self.clickText();
            }else if(this.$type==='images'){
                self.clickImages();
            }
        },
        clickText:function(){
        	var self=this;
        	self.$cont.delegate(self.$cont.children(),'click',function(e){
        		let type=$(e.target).attr('data-type');
        		if($(e.target).hasClass('font')){
					let attr=GetFontByType(type);
					let id=GenNonDuplicateID(12);
					attr.id=id;
					OperateEditArray.addEditList(attr); //添加对象到编辑数组中
					
					$('.text_attribute_box').show();
					$('.images_attribute_box').hide();
					//操作编辑区域
					self.operateEditBox();
        		}else{
        			return false;
        		}
        		
        	});
        	return self;
        },
        clickImages:function(){
			var self=this;
        	self.$cont.delegate(self.$cont.children(),'click',function(e){
        		let type=$(e.target).attr('data-type');
        		if(type==='images'){
        			let scale=parseFloat(($(e.target).width()/$(e.target).height()).toFixed(2));
        			let src=$(e.target).attr('src');
					let attr=GetImagesByType(scale,src);
					let id=GenNonDuplicateID(12);
					attr.id=id;
					OperateEditArray.addEditList(attr); //添加对象到编辑数组中
					
					$('.images_attribute_box').show();
					$('.text_attribute_box').hide();
					//操作编辑区域
					self.operateEditBox();
        		}else{
        			return false;
        		}
        		
        	});
        	return self;
        },
        operateEditBox:function(){
        	var self=this;
        	var onOffId='';//存储编辑对象的id;
        	self.operateCover();
        	
			$('.editBox').delegate($('.editBox').children(),'click',function(e){
			    if($(e.target).hasClass('textList') && $(e.target).attr('contenteditable')==='false'){
					let id=$(e.target).parent('.textList_render').attr('data-id');
					OperateEditArray.changEditListActive(id);
					$('.text_attribute_box').show();
					$('.images_attribute_box').hide();
				}
				else if($(e.target).hasClass('imagesList')){
					let id=$(e.target).attr('data-id');
					OperateEditArray.changEditListActive(id);
					$('.images_attribute_box').show();
					$('.text_attribute_box').hide();
				}
				else if($(e.target).hasClass('editBox')&&onOffId){

					let elem=$('.textList_render[data-id='+onOffId+']');
					OperateEditArray.updateEditList(onOffId,{
						text:elem.children('.textList').html(),
						height:elem.children('.textList').height()
					});
					OperateEditArray.changEditListContenteditableFalse('');//让选中的编辑区块不可编辑
				}
			});
			$('.editBox').delegate($('.editBox').children(),'dblclick',function(e){
				if($(e.target).hasClass('cover')){
					let id=$(e.target).attr('data-id');
					OperateEditArray.changEditListContenteditableFalse('');	//让所有的编辑区块不可编辑
					OperateEditArray.changEditListContenteditableTrue(id);	//让选中的编辑区块可编辑
					OperateEditArray.changEditListActive('');				//让cover消失
					onOffId=id;
				}
			});
			
			return self;
        },
        operateCover:function(){
			let self=this;
			let editAttr;
			let activeId;
			let targetObj;

			let initLeft=0;
			let initTop=0;
			let initWidth=0;
			let initHeight=0;
			let initClientX=0;
			let initClientY=0;
			let offsetLeft=0;
			let offsetTop=0;

			let nowLeft=0;
			let nowTop=0;
			let nowWidth=0;
			let nowHeight=0;
			
			$('#js_cover')[0].onmousedown=function(e){

				targetObj=$(e.target).attr('data-type');
				activeId=$(this).attr('data-id');
				editAttr=OperateEditArray.getEditList(activeId);
				initClientX=e.clientX;
				initClientY=e.clientY;
				initLeft=parseFloat($(this).position().left);
				initTop=parseFloat($(this).position().top);
				initWidth=parseFloat($(this).outerWidth());
				initHeight=parseFloat($(this).outerHeight());
				
				self.$doc[0].onmousemove=function(e){
					e.preventDefault();
					offsetLeft=e.clientX-initClientX;
					offsetTop=e.clientY-initClientY;
					
					if(targetObj==='LT'){
						nowLeft=initLeft+offsetLeft;
						nowTop=initTop+offsetTop;
						nowWidth=initWidth-offsetLeft;
						if(editAttr.type==='images'){
							nowHeight=nowWidth/editAttr.scale;
						}else{
							nowHeight=initHeight-offsetTop;
						}
					}
					else if(targetObj==='LB'){
						nowTop=initTop;
						nowLeft=initLeft+offsetLeft;
						nowWidth=initWidth-offsetLeft;

						if(editAttr.type==='images'){
							nowHeight=nowWidth/editAttr.scale;
						}else{
							nowHeight=initHeight+offsetTop;
						}
					}
					else if(targetObj==='RT'){
						
						nowLeft=initLeft;
						nowTop=initTop+offsetTop;
						nowWidth=initWidth+offsetLeft;
						if(editAttr.type==='images'){
							nowHeight=nowWidth/editAttr.scale;
						}else{
							nowHeight=initHeight-offsetTop;
						}
					}
					else if(targetObj==='RB'){
						nowTop=initTop;
						nowLeft=initLeft;
						nowWidth=initWidth+offsetLeft;

						if(editAttr.type==='images'){
							nowHeight=nowWidth/editAttr.scale;
						}else{
							nowHeight=initHeight+offsetTop;
						}
						
					}else{
						nowLeft=initLeft+offsetLeft;
						nowTop=initTop+offsetTop;
						nowWidth=initWidth;
						nowHeight=initHeight;
					}


					$('#js_cover').css('left',nowLeft)
					$('#js_cover').css('top',nowTop);
					$('#js_cover').css('width',nowWidth)
					$('#js_cover').css('height',nowHeight);
					
					OperateEditArray.updateEditList(activeId,{
						left:nowLeft,
						top:nowTop,
						width:nowWidth,
						height:nowHeight
					});
				};
				self.$doc[0].onmouseup=function(){
					self.$doc[0].onmousemove=null;
					self.$doc[0].onmouseup=null;
				}
			}
        }
    });
        
    win.ClickObj=ClickObj;
})(window,document,jQuery);


var FlyFactory=(function(){
	var createFlyObj={};
	return {
		create:function(type,cont){
			if(createFlyObj[type]){
				return createFlyObj[type];
			}
			return createFlyObj[type]=new ClickObj({
				type:type,
				cont:cont
			});
		}
	}
})();

//点击字体
FlyFactory.create("text",$('#js_tab_text'));
//点击图片
FlyFactory.create("images",$('#js_material_box'));
	

//监听EDITLIST数组
Observer.listen('editData',function(data){
	$('#js_editBox').find('.textList_render').remove();
	$('#js_editBox').find('.imagesList').remove();
	const textLists=data.filter(item =>item.type.indexOf('font') > -1);
	const imagesLists=data.filter(item =>item.type.indexOf('images') > -1);
	const coverLists=data.filter(item =>item.active===true);

	
	//添加字体
	$.each(textLists,function(index,item){
		//const textList=$('<div class="textList"	data-id="'+item.id+'">'+item.text+'</div>');

		const textListWrap =$('<div class="textList_render"	data-id="'+item.id+'"></div>');
		const textList=$('<div class="textList">'+item.text+'</div>');
		textListWrap.css('left',item.left);
		textListWrap.css('top',item.top);
		textListWrap.css('width',item.width);
		textListWrap.css('height',item.height);
		textListWrap.css('marginTop',item.marginTop);

		textList.css('textAlign',item.textAlign);
		textList.css('fontFamily',item.fontFamily);
		textList.css('fontSize',item.fontSize);
		textList.css('fontStyle',item.fontStyle);
		textList.css('fontWeight',item.fontWeight);
		textList.css('color',item.color);
		textList.css('textDecoration',item.textDecoration);
		textList.css('opacity',item.opacity);
		textList.css('lineHeight',item.lineHeight);
		textList.css('letterSpacing',item.letterSpacing);
		textList.attr('contenteditable',item['contenteditable']);
		
		textListWrap.append(textList);
		$('#js_editBox').append(textListWrap);
	});
	//添加图片
	$.each(imagesLists,function(index,item){
		const imagesList=$('<div class="imagesList"	data-id="'+item.id+'"></div>');
		for (let key in item) {
			imagesList[0].style[key]=item[key];
			imagesList.css(key,item[key]);
		}
		const url='url(../'+item.url+')center center no-repeat';
		imagesList.css('background',url);
		imagesList.css('background-size','contain');
		//imagesList.css('transform','rotate('+item.rotate+'deg)');
		$('#js_editBox').append(imagesList);
	});
	
	//添加cover
	if(coverLists.length===0){
		$('#js_cover').hide();
	}else{
		$.each(coverLists,function(index,item){
			$('#js_cover').show();
			for (let key in item) {
				$('#js_cover').css(key,item[key]);
			}
			$('#js_cover').css('z-index',(item['zIndex']+1));
			$('#js_cover').attr('data-id',item.id);
		});

		if(coverLists[0].type.indexOf('font')>-1){
			//文本渲染
			initRightTextContent(coverLists[0]);
			//文本操作
			operateRightTextContent(coverLists[0].id);
		}else if(coverLists[0].type==='images'){
			initRightImagesContent(coverLists[0]);
			operateRightImagesContent(coverLists[0].id);
		}
	}
	
});


function initRightTextContent(attr){
	$('.text_attribute_box').show();

	if(attr.fontWeight==='bold'){
		$('#js_text_style .h5_bold').addClass('active');
	}
	if(attr.fontStyle==='italic'){
		$('#js_text_style .h5_italic').addClass('active');
	}
	if(attr.textDecoration==='underline'){
		$('#js_text_style .h5_underline').addClass('active');
	}
	if(attr.textAlign==='left'){
		$('#js_text_style .h5_leftAlign').addClass('active');
	}
	if(attr.textAlign==='center'){
		$('#js_text_style .h5_centerAlign').addClass('active');
	}
	if(attr.textAlign==='right'){
		$('#js_text_style .h5_rightAlign').addClass('active');
	}
	$('#js_color').val(attr.color);
	$('#js_color').minicolors({
	    control: $(this).attr('data-control') || 'hue',
	    defaultValue: $(this).attr('data-defaultValue') || '',
	    inline: $(this).attr('data-inline') === 'true',
	    letterCase: $(this).attr('data-letterCase') || 'lowercase',
	    opacity: $(this).attr('data-opacity'),
	    position: $(this).attr('data-position') || 'bottom left',
	    change: function(hex, opacity) {
	        if (!hex)
	            return;
	        if (opacity)
	            hex += ', ' + opacity;
	        try {
	            $('#js_color').val(hex);
	        } catch (e) {
	            console.log(e);
	        }
	    },
	    theme: 'bootstrap'
	});

	$('#js_text_fontsize').val(parseInt(attr.fontSize));
	$('#js_text_fontfamily').val(attr.fontFamily);
	$('#js_text_lineheight').val(attr.lineHeight);
	$('#text_opacity_range').val(attr.opacity);
	$('#text_opacity_text').val(attr.opacity+'%');
	$('#js_text_pos_x').val(attr.left);
	$('#js_text_pos_y').val(attr.top);
	$('#js_text_pos_width').val(attr.width);
	$('#js_text_pos_height').val(attr.height);
}

function operateRightTextContent(id){
	let activeId=id;

	$('#js_text_style .h5_bold').off().on('click',function(){
		let fontWeight;
		console.log($(this).hasClass('active'))
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			fontWeight='normal';
		}else{
			$(this).addClass('active');
			fontWeight='bold';
		}
		OperateEditArray.updateEditList(activeId,{
			fontWeight:fontWeight
		});
	});
	$('#js_text_style .h5_italic').off().on('click',function(){
		let fontStyle;
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			fontStyle='normal';
		}else{
			$(this).addClass('active');
			fontStyle='italic';
		}
		OperateEditArray.updateEditList(activeId,{
			fontStyle:fontStyle
		});
	});
	$('#js_text_style .h5_underline').off().on('click',function(){
		let textDecoration;
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			textDecoration='none';
		}else{
			$(this).addClass('active');
			textDecoration='underline';
		}
		OperateEditArray.updateEditList(activeId,{
			textDecoration:textDecoration
		});
	});
	$('#js_text_style .h5_leftAlign').off().on('click',function(){
		let textAlign;

		$(this).addClass('active');
		$(this).siblings('.h5_centerAlign,.h5_rightAlign').removeClass('active');
		textAlign='left';
		OperateEditArray.updateEditList(activeId,{
			textAlign:textAlign
		});
	});
	$('#js_text_style .h5_centerAlign').off().on('click',function(){
		let textAlign;

		$(this).addClass('active');
		$(this).siblings('.h5_leftAlign,.h5_rightAlign').removeClass('active');
		textAlign='center';
		OperateEditArray.updateEditList(activeId,{
			textAlign:textAlign
		});
	});
	$('#js_text_style .h5_rightAlign').off().on('click',function(){
		let textAlign;

		$(this).addClass('active');
		$(this).siblings('.h5_centerAlign,.h5_leftAlign').removeClass('active');
		textAlign='right';
		OperateEditArray.updateEditList(activeId,{
			textAlign:textAlign
		});
	});
	
	$('#js_color').off().on('change',function(){
		OperateEditArray.updateEditList(activeId,{
			color:$(this).val()
		});
	});
	$('#js_text_fontsize').off().on('change',function(){
		OperateEditArray.updateEditList(activeId,{
			fontSize:$(this).val()+'px'
		});
	});
	$('#js_text_fontfamily').off().on('change',function(){
		OperateEditArray.updateEditList(activeId,{
			fontFamily:$(this).val()
		});
	});
	$('#js_text_lineheight').off().on('change',function(){
		OperateEditArray.updateEditList(activeId,{
			lineHeight:$(this).val()
		});
	});
	$('#text_opacity_range')[0].oninput=function(e){
		console.log(parseFloat($(e.target).val()))
		OperateEditArray.updateEditList(activeId,{
			opacity:parseFloat($(e.target).val())
		});
	};
	$('#text_opacity_text').off().on('change',function(e){
		OperateEditArray.updateEditList(activeId,{
			opacity:parseFloat($(e.target).val())
		});
	});
	$('#js_text_pos_x')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			left:parseFloat($(e.target).val())
		});
	};
	$('#js_text_pos_y')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			top:parseFloat($(e.target).val())
		});
	};
	$('#js_text_pos_width')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			width:parseFloat($(e.target).val())
		});
	};
	$('#js_text_pos_height')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			height:parseFloat($(e.target).val())
		});
	};
}

function initRightImagesContent(attr){
	$('#images_opacity_range').val(attr.opacity);
	$('#images_opacity_text').val(attr.opacity+'%');

	$('#images_radius_range').attr('max',attr.height/2);
	$('#images_radius_range').val(attr.borderRadius);
	$('#images_radius_text').val(attr.borderRadius+'px');
	

	$('#images_rotate_range').val(attr.rotate);
	$('#images_rotate_text').val(attr.rotate+'°');
	
	$('#js_images_pos_x').val(attr.left);
	$('#js_images_pos_y').val(attr.top);
	$('#js_images_pos_width').val(attr.width);
	$('#js_images_pos_height').val(attr.height);
	
}

function operateRightImagesContent(id){
	let activeId=id;

	
	$('#images_opacity_range')[0].oninput=function(e){
		OperateEditArray.updateEditList(activeId,{
			opacity:parseFloat($(e.target).val())
		});
	};
	$('#images_radius_range')[0].oninput=function(e){
		console.log(parseFloat($(e.target).val()))
		OperateEditArray.updateEditList(activeId,{
			borderRadius:parseFloat($(e.target).val())
		});
	};

	$('#images_rotate_range')[0].oninput=function(e){
		console.log(parseFloat($(e.target).val()))
		OperateEditArray.updateEditList(activeId,{
			rotate:parseFloat($(e.target).val())
		});
	};
	$('#js_images_pos_x')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			left:parseFloat($(e.target).val())
		});
	};
	$('#js_images_pos_y')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			top:parseFloat($(e.target).val())
		});
	};
	$('#js_images_pos_width')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			width:parseFloat($(e.target).val())
		});
	};
	$('#js_images_pos_height')[0].onchange=function(e){
		OperateEditArray.updateEditList(activeId,{
			height:parseFloat($(e.target).val())
		});
	};
}


});