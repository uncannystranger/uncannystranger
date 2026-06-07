/*!
 * Gist Simple v2.0.1 (https://github.com/nk-o/gist-simple)
 * Copyright 2023 nK <https://nkdev.info>
 * Licensed under MIT (https://github.com/nk-o/gist-simple/blob/master/LICENSE)
 */
(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global=typeof globalThis!=='undefined'?globalThis:global||self,global.gistSimple=factory())})(this,(function(){'use strict';function ready(callback){if(document.readyState==='complete'||document.readyState==='interactive'){callback()}else{document.addEventListener('DOMContentLoaded',callback,{capture:!0,once:!0,passive:!0})}}
let win;if(typeof window!=='undefined'){win=window}else if(typeof global!=='undefined'){win=global}else if(typeof self!=='undefined'){win=self}else{win={}}
var global$1=win;function extend(out,...args){out=out||{};Object.keys(args).forEach(i=>{if(!args[i]){return}
Object.keys(args[i]).forEach(key=>{out[key]=args[i][key]})});return out}
function Deferred(){this.doneCallbacks=[];this.failCallbacks=[]}
Deferred.prototype={execute(list,args){let i=list.length;args=Array.prototype.slice.call(args);while(i){i-=1;list[i].apply(null,args)}},resolve(...args){this.execute(this.doneCallbacks,args)},reject(...args){this.execute(this.failCallbacks,args)},done(callback){this.doneCallbacks.push(callback)},fail(callback){this.failCallbacks.push(callback)}};const NAME_FLAG='__gist_simple_jsonp__';function loadJSONP(url,params){const{data={},beforeSend,success}=params;window[NAME_FLAG]=(window[NAME_FLAG]||0)+1;data.callback=`${NAME_FLAG}_cb_${window[NAME_FLAG]}`;Object.keys(data).forEach(k=>{if(url.match(/\?/)){url+=`&${k}=${data[k]}`}else{url+=`?${k}=${data[k]}`}});if(beforeSend&&!beforeSend()){return}
let script=document.createElement('script');script.type='text/javascript';script.src=url;window[data.callback]=function(response){success.call(window,response);document.head.removeChild(script);script=null;delete window[data.callback]};document.head.appendChild(script)}
const LOADED_FLAG='__gist_simple_css_loaded__';function loadCSS(url,callback,doc=document){let el=doc.body.querySelector(`link[href="${url}"]`);if(!el){el=doc.createElement('link');el.href=url;el.rel='stylesheet';el.type='text/css';doc.head.appendChild(el)}
if(callback){if(el[LOADED_FLAG]){callback(el);return}
el.addEventListener('load',()=>{el[LOADED_FLAG]=!0;callback(el)},!1)}}
var iconArrow="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 44\" style=\"height: 15px; position: relative; top: 2px;\">\n  <path fill=\"#bbb\" fill-rule=\"evenodd\"\n    d=\"M8.0066 16.05305v-7.6523c0-.82422-.47656-1.0273-1.0586-.4414l-3.5117 3.5039c-1.8789 1.875-4.6953-.94142-2.8164-2.8164L8.7215.61564c.68359-.67579 1.8008-.6797 2.4922 0l8.1641 8.0312c1.8789 1.875-.9375 4.6914-2.8164 2.8164l-3.5078-3.5039c-.58984-.58985-1.0625-.38673-1.0625.4414v27.30827c0 .82031.47656 1.0273 1.0586.44141l3.5117-3.5039c1.8789-1.875 4.6953.9375 2.8164 2.8164l-8.1016 8.0273c-.6836.6797-1.8008.6797-2.4922 0l-8.1641-8.0273c-1.8789-1.8789.9375-4.6914 2.8164-2.8164l3.5078 3.5039c.58984.58984 1.0625.38672 1.0625-.4414V16.05304z\" />\n</svg>";var defaults={id:'',file:'',caption:'',lines:'',linesExpanded:!1,highlightLines:'',showFooter:!0,showLineNumbers:!0,enableCache:!0,onInit:null,onInitEnd:null,onDestroy:null,onDestroyEnd:null,onAjaxBeforeSend:null,onAjaxSuccess:null,onAjaxLoaded:null};const cache={};let instanceID=0;const loadingIcon='<span class="gist-simple-loading-icon"><i></i><i></i><i></i></span>';class GistSimple{constructor(container,userOptions){const self=this;self.instanceID=instanceID;instanceID+=1;self.$container=container;self.defaults={...defaults};const dataOptions=self.$container.dataset||{};const pureDataOptions={};Object.keys(dataOptions).forEach(key=>{if(key&&typeof self.defaults[key]!=='undefined'){pureDataOptions[key]=dataOptions[key]}});self.options=extend({},self.defaults,pureDataOptions,userOptions);self.pureOptions=extend({},self.options);Object.keys(self.options).forEach(key=>{if(self.options[key]==='true'){self.options[key]=!0}else if(self.options[key]==='false'){self.options[key]=!1}});self.init()}
init(){const self=this;const{options}=self;const url=`https://gist.github.com/${options.id}.json`;const{lines}=options;const data={};if(self.options.onInit){self.options.onInit.call(self)}
if(options.file){data.file=options.file}
self.$container.classList.add('gist-simple');if(!options.id){self.insertContent('Gist ID is required',!0);return}
const cacheUrl=url+options.file;const enableCache=options.enableCache||cache[cacheUrl];self.insertContent(loadingIcon,!0);function insertGist(response){const $responseDiv=document.createElement('div');$responseDiv.innerHTML=response.div;if($responseDiv.firstChild){$responseDiv.firstChild.removeAttribute('id')}
self.insertContent($responseDiv.innerHTML);self.highlightLines(options.highlightLines);self.showSpecificLines(lines,options.linesExpanded);self.showCaption(options.caption);if(!options.showFooter){self.removeFooter()}
if(!options.showLineNumbers){self.removeLineNumbers()}
if(self.options.onAjaxLoaded){self.options.onAjaxLoaded.call(self,response)}}
function successCallback(response){if(response&&response.div){let{stylesheet}=response;if(stylesheet){if(stylesheet.indexOf('<link')===0){stylesheet=stylesheet.replace(/\\/g,'').match(/href="([^\s]*)"/);[stylesheet]=stylesheet}else if(stylesheet.indexOf('http')!==0){if(stylesheet.indexOf('/')!==0){stylesheet=`/${stylesheet}`}
stylesheet=`https://gist.github.com${stylesheet}`}
loadCSS(stylesheet,()=>{insertGist(response)},self.$container.ownerDocument)}else{insertGist(response)}}else{self.insertContent(`Failed loading gist ${url}`,!0)}}
function errorCallBack(textStatus){self.insertContent(`Failed loading gist ${url}: ${textStatus}`,!0)}
loadJSONP(url,{data,beforeSend(){if(self.options.onAjaxBeforeSend){self.options.onAjaxBeforeSend.call(self)}
if(enableCache){if(cache[cacheUrl]){if(cache[cacheUrl].div){successCallback(cache[cacheUrl]);return!1}
cache[cacheUrl].done(response=>{successCallback(response)});cache[cacheUrl].fail(errorStatus=>{errorCallBack(errorStatus)});return!1}
cache[cacheUrl]=new Deferred()}
return!0},success(response){if(self.options.onAjaxSuccess){self.options.onAjaxSuccess.call(self,response)}
if(enableCache){if(cache[cacheUrl]&&cache[cacheUrl].resolve){cache[cacheUrl].resolve(response);cache[cacheUrl]=response}}
successCallback(response)},error(textStatus){errorCallBack(textStatus)}});if(self.options.onInitEnd){self.options.onInitEnd.call(self)}}
destroy(){const self=this;if(self.options.onDestroy){self.options.onDestroy.call(self)}
self.$container.innerHTML='';delete self.$container.GistSimple;if(self.options.onDestroyEnd){self.options.onDestroyEnd.call(self)}}
chunkBy(items,predicate){if(items.length===0){return[]}
return items.slice(1).reduce((chunked,item)=>{if(predicate(item)){chunked.push([item])}else{chunked.push(chunked.pop().concat([item]))}
return chunked},[items.slice(0,1)])}
getLineNumbers(lineRangeString){const lineNumbers=[];let range;let lineNumberSections;if(typeof lineRangeString==='number'){lineNumbers.push(lineRangeString)}else{lineNumberSections=lineRangeString.split(',');for(let i=0;i<lineNumberSections.length;i+=1){range=lineNumberSections[i].split('-');if(range.length===2){for(let j=parseInt(range[0],10);j<=range[1];j+=1){lineNumbers.push(j)}}else if(range.length===1){lineNumbers.push(parseInt(range[0],10))}}}
return lineNumbers}
insertContent(content,wrapper=!1){if(wrapper){content=`<div class="gist-simple-wrap">${content}</div>`}
this.$container.innerHTML=content}
highlightLines(lines){if(!lines){return}
const highlightLineNumbers=this.getLineNumbers(lines);this.$container.querySelectorAll('td.line-data').forEach(el=>{el.style.width='100%'});this.$container.querySelectorAll('.js-file-line').forEach((el,index)=>{if(highlightLineNumbers.indexOf(index+1)!==-1){el.style.backgroundColor='rgb(255, 255, 204)'}})}
showSpecificLines(lines,linesExpanded){if(!lines){return}
const lineNumbers=this.getLineNumbers(lines);const collapsableLineNumbers=[];this.$container.querySelectorAll('.js-file-line').forEach((el,index)=>{if(lineNumbers.indexOf(index+1)===-1){if(linesExpanded){collapsableLineNumbers.push(index+1);el.parentNode.style.display='none'}else{el.parentNode.remove()}}});if(linesExpanded){const collapsableBlocks=this.chunkBy(collapsableLineNumbers,line=>!collapsableLineNumbers.includes(line-1));collapsableBlocks.forEach(block=>{const firstLine=block[0];const lineBeforeFirstLine=firstLine-1;const lastLine=block[block.length-1];const $collapsibleIcon=document.createElement('a');$collapsibleIcon.setAttribute('lines',block.join());$collapsibleIcon.style.display='block';$collapsibleIcon.style.cursor='pointer';$collapsibleIcon.innerHTML=iconArrow;$collapsibleIcon.addEventListener('click',event=>{event.preventDefault();$collapsibleIcon.closest('table.highlight').querySelectorAll('tr[style*="display: none"] td[data-line-number]').forEach(function($element){const foundLines=$collapsibleIcon.getAttribute('lines').split(',');const lineNumber=$element.getAttribute('data-line-number');if(foundLines.indexOf(lineNumber)===-1){return}
$element.parentNode.style.display=''});$collapsibleIcon.closest('tr').remove()});const lineNumberElement=`
          <td
            class="blob-num js-line-number collapsed"
            style="background-color: #f9f9f9; color: #999; font-size: 12px; font-style: italic; text-align: center; padding-top: 5px !important; padding-bottom: 5px !important;"
          ><!-- Icon Here --></td>
        `;const lineCodeElement=`
          <td
            class="blob-code blob-code-inner js-file-line collapsed"
            style="background-color: #f9f9f9; color: #999; font-size: 12px; font-style: italic; padding-top: 5px !important; padding-bottom: 5px !important;"
          >... Lines ${firstLine} - ${lastLine}</td>
        `;const $lineElement=document.createElement('tr');$lineElement.innerHTML=lineNumberElement+lineCodeElement;$lineElement.querySelector('td:first-child').append($collapsibleIcon);const $line=this.$container.querySelector(`.js-line-number[data-line-number="${lineBeforeFirstLine === 0 ? 1 : lineBeforeFirstLine}"]`);if($line){if(lineBeforeFirstLine===0){$line.parentElement.before($lineElement)}else{$line.parentElement.after($lineElement)}}})}}
showCaption(caption){if(!caption){return}
const tbody=this.$container.querySelector('table tbody');const $row=document.createElement('tr');const $captionColumn=document.createElement('td');$captionColumn.setAttribute('style','padding: 10px !important; border-bottom: 10px solid white; background-color: #f9f9f9; font-weight: bold;');$captionColumn.innerHTML=caption;const $rowBorder=document.createElement('td');$rowBorder.setAttribute('style','background-color: #f9f9f9; border-bottom: 10px solid white;');$row.append($rowBorder);$row.append($captionColumn);tbody.prepend($row)}
removeFooter(){this.$container.querySelector('.gist-meta').remove();this.$container.querySelector('.gist-data').style.borderBottom='0px';this.$container.querySelector('.gist-file').style.borderBottom='1px solid #ddd'}
removeLineNumbers(){this.$container.querySelectorAll('.js-line-number').forEach(el=>{el.remove()});this.$container.querySelector('table.highlight').style.width='100%'}}
const gistSimple=function(items,options,...args){if(typeof HTMLElement==='object'?items instanceof HTMLElement:items&&typeof items==='object'&&items!==null&&items.nodeType===1&&typeof items.nodeName==='string'){items=[items]}
const len=items.length;let k=0;let ret;for(k;k<len;k+=1){if(typeof options==='object'||typeof options==='undefined'){if(!items[k].GistSimple){items[k].GistSimple=new GistSimple(items[k],options)}}else if(items[k].GistSimple){ret=items[k].GistSimple[options].apply(items[k].GistSimple,args)}
if(typeof ret!=='undefined'){return ret}}
return items};gistSimple.constructor=GistSimple;const $=global$1.jQuery;if(typeof $!=='undefined'){const $Plugin=function(...args){Array.prototype.unshift.call(args,this);const res=gistSimple.apply(global$1,args);return typeof res!=='object'?res:this};$Plugin.constructor=gistSimple.constructor;const old$Plugin=$.fn.gistSimple;$.fn.gistSimple=$Plugin;$.fn.gistSimple.noConflict=function(){$.fn.gistSimple=old$Plugin;return this}}
ready(()=>{gistSimple(document.querySelectorAll('.gist-simple[data-id]'))});return gistSimple}))