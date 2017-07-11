/**
 * jq 源码解析
 * 2017.06.02
 */
'use strict';
function GQuery(arg){  //存储东西

    this.elements=[]; //存选择出来元素
    this.domString=''; //存待创建元素字符串

    switch (typeof arg){
        case 'function':
            domReady(arg);
            break;
        case 'string':
            if(arg.indexOf('<')!=-1){
                this.domString=arg;
            }else{
                this.elements=getEle(arg);
                this.length=this.elements.length;
            }
            break;
        default :
            if(arg instanceof Array){
                this.elements=arg;
            }else{
                this.elements.push(arg);
            }
            break;
    }
}
//css
GQuery.prototype.css=function(name,value){
    if(arguments.length==2){
        for(var i=0; i<this.elements.length; i++){
            this.elements[i].style[name]=value;
        }
    }else{
        if(typeof name=='string'){ //获取
            return getStyle(this.elements[0],name);
        }else{ //批量设置
            var json=name;
            for(var i=0; i<this.elements.length; i++){
                for(var name in json){
                    this.elements[i].style[name]=json[name];
                }
            }
        }
    }
};
//attr
GQuery.prototype.attr=function(name,value){
    if(arguments.length==2){
        for(var i=0; i<this.elements.length; i++){
            this.elements[i].setAttribute(name,value);
        }
    }else{
        if(typeof name=='string'){ //获取
            return this.elements[0].getAttribute(name);
        }else{ //批量设置
            var json=name;
            for(var i=0; i<this.elements.length; i++){
                for(var name in json){
                    this.elements[i].setAttribute(name,json[name]);
                }
            }
        }
    }
};
//内容
GQuery.prototype.val=function(str){
    if(str || str==''){
        for(var i=0; i<this.elements.length; i++){
            this.elements[i].value=str;
        }
    }else{
        return this.elements[0].value;
    }
};
GQuery.prototype.html=function(str){
    if(str || str==''){
        for(var i=0; i<this.elements.length; i++){
            this.elements[i].innerHTML=str;
        }
    }else{
        return this.elements[0].innerHTML;
    }
};
//class
GQuery.prototype.addClass=function(sClass){
    var reg=new RegExp('\\b'+sClass+'\\b');
    for(var i=0; i<this.elements.length; i++){
        if(this.elements[i].className){
            if(!reg.test(this.elements[i].className)){
                this.elements[i].className+=' '+sClass;
            }
        }else{
            this.elements[i].className=sClass;
        }
    }
};
GQuery.prototype.removeClass=function(sClass){
    var reg=new RegExp('\\b'+sClass+'\\b','g');
    for(var i=0; i<this.elements.length; i++){
        if(reg.test(this.elements[i].className)){
            this.elements[i].className=this.elements[i].className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
        }
    }
};
//show ,hide
GQuery.prototype.hide=function(){
    for(var i=0; i<this.elements.length; i++){
        this.elements[i].style.display='none';
    }
};
GQuery.prototype.show=function(){
    for(var i=0; i<this.elements.length; i++){
        this.elements[i].style.display='block';
    }
};
//基本事件
/*GQuery.prototype.click=function(fn){
    for(var i=0; i<this.elements.length; i++){
        addEvent(this.elements[i],'click',fn);
    }
};*/
;'click mouseover dblclick mouseout mousedown mousemove mouseup keydown keyup contextmenu blur focus resize load scroll'.replace(/\w+/g,function(sEv){
    GQuery.prototype[sEv]=function(fn){
        for(var i=0; i<this.elements.length; i++){
            addEvent(this.elements[i],sEv,fn);
        }
    };
});
//animate
GQuery.prototype.animate=function(json,options){
    for(var i=0; i<this.elements.length; i++){
        move(this.elements[i],json,options);
    }
};
//eq
GQuery.prototype.eq=function(n){
    return $(this.elements[n]);
};
//get
GQuery.prototype.get=function(n){
    return this.elements[n];
};
//index
GQuery.prototype.index=function(){
    var obj=this.elements[this.elements.length-1];

    var aSibling=obj.parentNode.children;

    for(var i=0; i<aSibling.length; i++){
        if(obj==aSibling[i]){
            return i;
        }
    }
};
//DOM
GQuery.prototype.appendTo=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
    }
};
GQuery.prototype.prependTo=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('afterBegin',this.domString);
    }
};
GQuery.prototype.insertBefore=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
    }
};
GQuery.prototype.insertAfter=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('afterEnd',this.domString);
    }
};
GQuery.prototype.remove=function(){
    for(var i=0; i<this.elements.length; i++){
        this.elements[i].parentNode.removeChild(this.elements[i]);
    }
};

//解决over问题
GQuery.prototype.mouseenter=function(fn){
    for(var i=0; i<this.elements.length; i++){
        addEvent(this.elements[i],'mouseover',function(ev){
            var from=ev.fromElement || ev.relatedTarget;

            if(this.contains(from))return;

            fn && fn.apply(this,arguments);
        });
    }
};

GQuery.prototype.mouseleave=function(fn){
    for(var i=0; i<this.elements.length; i++){
        addEvent(this.elements[i],'mouseout',function(ev){
            var to=ev.toElement || ev.relatedTarget;

            if(this.contains(to))return;

            fn && fn.apply(this,arguments);
        });
    }
};

GQuery.prototype.hover=function(fnOver,fnOut){
    this.mouseenter(fnOver);
    this.mouseleave(fnOut);
};
//toggle
GQuery.prototype.toggle=function(){
    var arg=arguments;
    var _this=this;
    for(var i=0; i<this.elements.length; i++){
        (function(count){
            addEvent(_this.elements[i],'click',function(){
                var n=count%arg.length;

                var fn=arg[n];

                fn && fn.apply(this,arguments);

                count++;
            })
        })(0);
    }
};

function $(arg){
    return new GQuery(arg);
}

//交互
$.ajax=function(json){
    ajax(json);
};

//插件
$.fn=GQuery.prototype;

$.fn.extend=function(json){
    for(var name in json){
        GQuery.prototype[name]=json[name];
    }
};

//其他
GQuery.prototype.find=function(str){
    //this.elements  str
    var aEle=getEle(str,this.elements);
    return $(aEle);
};
GQuery.prototype.each=function(fn){
    for(var i=0; i<this.elements.length; i++){
        fn && fn.call(this.elements[i],i,this.elements[i]);
    }
};

//-------------以下是公共函数-----------------
function json2url(json){
    json.t=Math.random();
    
    var arr=[];
    for(var name in json){
        arr.push(name+'='+json[name]);
    }
    return arr.join('&');
}
function ajax(json){
    json=json || {};
    if(!json.url)return;
    json.type=json.type || 'get';
    json.timeout=json.timeout || 4000;
    json.data=json.data || {};

    if(json.dataType=='jsonp'){
        json.jsonp=json.jsonp || 'callback';
        
        var fnName='jsonp'+Math.random();
        fnName=fnName.replace('.','');
        
        window[fnName]=function(data){
            json.success && json.success(data); 
            
            //删除
            oHead.removeChild(oS);
        }
        
        json.data[json.jsonp]=fnName;
        
        var oS=document.createElement('script');    
        oS.src=json.url+'?'+json2url(json.data);
        var oHead=document.getElementsByTagName('head')[0];
        oHead.appendChild(oS); 
        return; 
    }
    
    var timer=null;
    
    if(window.XMLHttpRequest){
        var oAjax=new XMLHttpRequest();
    }else{
        var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }
    
    switch(json.type.toLowerCase()){
        case 'get':
            oAjax.open('GET',json.url+'?'+json2url(json.data),true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST',json.url,true);
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            oAjax.send(json2url(json.data));
            break;
    }
    
    //网络加载中
    json.fnLoading && json.fnLoading();
    
    
    oAjax.onreadystatechange=function(){
        if(oAjax.readyState==4){
            
            json.complete && json.complete();
            
            clearTimeout(timer);
            if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
                if(json.dataType=='xml'){
                    json.success && json.success(oAjax.responseXML);
                }else{
                    json.success && json.success(oAjax.responseText);   
                }   
            }else{
                json.error && json.error(oAjax.status);
            }
        }   
    };
    
    //
    timer=setTimeout(function(){
        oAjax.onreadystatechange=null;
        alert('网络超时了');
    },json.timeout);
}
function addEvent(obj,sEv,fn){
    if(obj.addEventListener){
        obj.addEventListener(sEv,function(ev){
            var oEvent=ev || event;
            if(fn.call(obj,oEvent)==false){
                oEvent.cancelBubble=true;
                oEvent.preventDefault();
            }
        },false);
    }else{
        obj.attachEvent('on'+sEv,function(ev){
            var oEvent=ev || event;
            if(fn.call(obj,oEvent)==false){
                oEvent.cancelBubble=true;
                return false;
            }
        });
    }
}
function getStyle(obj,name){
    return (obj.currentStyle || getComputedStyle(obj,false))[name];
}
function move(obj,json,options){
    options=options || {};
    options.duration =options.duration || 500;
    options.easing=options.easing || 'ease-out';

    var count=Math.floor(options.duration/30);
    var start={};
    var dis={};

    for(var name in json){
        start[name]=parseFloat(getStyle(obj,name));
        if(isNaN(start[name])){
            switch(name){
                case 'left':
                    start[name]=obj.offsetLeft;
                    break;
                case 'top':
                    start[name]=obj.offsetTop;
                    break;
                case 'width':
                    start[name]=obj.offsetWidth;
                    break;
                case 'height':
                    start[name]=obj.offsetHeight;
                    break;
                case 'opacity':
                    start[name]=1;
                    break;
                //borderWidth fontSize paddingLeft marginLeft
                //.....
            }
        }

        dis[name]=json[name]-start[name];
    }

    clearInterval(obj.timer);

    var n=0;

    obj.timer=setInterval(function(){
        n++;

        for(var name in json){

            switch(options.easing){
                case 'linear':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a;
                    break;
                case 'ease-in':
                    var a=n/count;
                    var cur=start[name]+dis[name]*a*a*a;
                    break;
                case 'ease-out':
                    var a=1-n/count;
                    var cur=start[name]+dis[name]*(1-a*a*a);
                    break;
            }

            if(name=='opacity'){
                obj.style.opacity=cur;
                obj.style.filter='alpha(opacity:'+cur*100+')';
            }else{
                obj.style[name]=cur+'px';
            }
        }

        if(n==count){
            clearInterval(obj.timer);
            options.complete && options.complete.call(obj);
        }
    },30);

}
function domReady(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',fn,false);
    }else{
        document.attachEvent('onreadystatechange',function(){
            if(document.readyState=='complete'){
                fn && fn();
            }
        });
    }
}
function getByClass(oParent,sClass){
    if(oParent.getElementsByClassName){
        return oParent.getElementsByClassName(sClass);
    }else{
        var arr=[];
        var reg=new RegExp('\\b'+sClass+'\\b');
        var aEle=oParent.getElementsByTagName('*');
        for(var i=0; i<aEle.length; i++){
            if(reg.test(aEle[i].className)){
                arr.push(aEle[i]);
            }
        }
        return arr;
    }
}

function getByStr(aParent,str){
    var aChild=[];

    for(var i=0; i<aParent.length; i++){
        switch(str.charAt(0)){
            case '#':
                var obj=document.getElementById(str.substring(1));
                aChild.push(obj);
                break;
            case '.':
                var aEle=getByClass(aParent[i],str.substring(1));
                for(var j=0; j<aEle.length; j++){
                    aChild.push(aEle[j]);
                }
                break;
            default :
                if(/\w+\[\w+=\w+\]/.test(str)){  //input[type=button]
                    var aStr=str.split(/\[|=|\]/);
                    var aEle=aParent[i].getElementsByTagName(aStr[0]);
                    for(var j=0; j<aEle.length; j++){
                        if(aEle[j].getAttribute(aStr[1])==aStr[2]){
                            aChild.push(aEle[j]);
                        }
                    }

                }else if(/\w+:\w+(\(\d+\))?/.test(str)){ //li:first li:eq(2)
                    var aStr=str.split(/:|\(|\)/);
                    var aEle=aParent[i].getElementsByTagName(aStr[0]);
                    switch (aStr[1]){
                        case 'first':
                            aChild.push(aEle[0]);
                            break;
                        case 'last':
                            aChild.push(aEle[aEle.length-1]);
                            break;
                        case 'eq':
                            aChild.push(aEle[aStr[2]]);
                            break;
                        case 'lt':
                            for(var j=0; j<aStr[2]; j++){
                                aChild.push(aEle[j]);
                            }
                            break;
                        case 'gt':
                            for(var j=parseInt(aStr[2])+1; j<aEle.length; j++){
                                aChild.push(aEle[j]);

                            }
                            break;
                        case 'odd':
                            for(var j=1; j<aEle.length; j+=2){
                                aChild.push(aEle[j]);
                            }
                            break;
                        case 'even':
                            for(var j=0; j<aEle.length; j+=2){
                                aChild.push(aEle[j]);
                            }
                            break;

                    }

                }else{  //纯标签
                    var aEle=aParent[i].getElementsByTagName(str);
                    for(var j=0; j<aEle.length; j++){
                        aChild.push(aEle[j]);
                    }
                }
                break;
        }
    }

    return aChild;
}

function getEle(str,aParent){
    var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/);

    var aParent=aParent || [document];
    var aResult=[];

    for(var i=0; i<arr.length; i++){
        aResult=getByStr(aParent,arr[i]);

        aParent=aResult;
    }
    return aResult;
}











