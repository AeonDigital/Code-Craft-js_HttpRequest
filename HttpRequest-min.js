var HttpRequest=function(c){var http=new XMLHttpRequest();var evtTimeout=null;var cfg={method:'POST',async:true,dataType:'json',contentType:'application/x-www-form-urlencoded; charset=UTF-8',onSucess:function(result){},onComplete:function(){},onTimeout:function(){},onFail:function(statusCode,statusText){alert('Erro na requisição.\nCode : '+statusCode+'\nError : '+statusText)},timeout:15000};if(c!==undefined){for(var it in c){cfg[it]=c[it]}}var OnStateChange=function(){var state=http.readyState;if(state==0||state==4){clearTimeout(evtTimeout);var status=http.status;if(status==0||(status>=200&&status<300)||(status==304||status==1223)){var obj=http.responseText;switch(cfg.dataType){case'json':try{obj=eval('('+obj+')')}catch(e){obj=null}break;case'xml':var parser=new DOMParser();obj=parser.parseFromString(obj,"text/xml");break}cfg.onSucess(obj)}else{cfg.onFail(http.status,http.statusText,http.response)}cfg.onComplete()}};var AbortOnTimeout=function(){http.abort();cfg.onTimeout();clearTimeout(evtTimeout)};this.Load=function(url,params){var method=cfg.method.toUpperCase();if(url.indexOf(' ')!=-1){var spl=url.split(' ');method=spl[0].toUpperCase();url=spl[1]}if(url.indexOf('://')==-1){var port=(window.location.port)?':'+window.location.port:'';url=(url.indexOf('/')==0)?url.substring(1):url;url=window.location.protocol+'//'+window.location.hostname+port+'/'+url}switch(method){case'GET':if(params!==undefined){url+='?'+params}http.open(method,url,cfg.async);http.onreadystatechange=OnStateChange;http.send(null);break;case'PUT':case'POST':case'PATCH':case'DELETE':http.open(method,url,cfg.async);http.onreadystatechange=OnStateChange;if(params!==undefined&&params!==null){http.setRequestHeader("Content-type",cfg.contentType)}else{params=null}http.send(params);break}evtTimeout=setTimeout(AbortOnTimeout,cfg.timeout)}};