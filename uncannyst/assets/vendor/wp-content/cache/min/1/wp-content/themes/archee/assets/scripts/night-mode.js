(function($){'use strict';if('undefined'===typeof VLT_NIGHT_MODE){return}
const $doc=$(document);let $html=$('html');function switchMode(toggle=!0){if(!$html||!$html.length){return}
const storedState=localStorage.getItem('night-mode');let defaultValue=VLT_NIGHT_MODE.defaultValue;if(VLT_NIGHT_MODE.useLocalStorage&&storedState){defaultValue=storedState}else if(window.matchMedia&&'auto'===defaultValue){defaultValue=window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'}
if(toggle){defaultValue='day'===defaultValue?'night':'day'}
$html.addClass('no-transition');if('night'===defaultValue){$html.addClass('night-mode').trigger('vlt.night-mode');if(toggle){localStorage.setItem('night-mode','night')}
if(VLT_NIGHT_MODE.on_click_sound&&typeof Howl!=='undefined'){new Howl({src:[VLT_NIGHT_MODE.on_click_sound],autoplay:!0,loop:!1,volume:0.3})}}else{$html.removeClass('night-mode').trigger('vlt.night-mode');if(toggle){localStorage.setItem('night-mode','day')}
if(VLT_NIGHT_MODE.off_click_sound&&typeof Howl!=='undefined'){new Howl({src:[VLT_NIGHT_MODE.off_click_sound],autoplay:!0,loop:!1,volume:0.3})}}
if($html[0]){$html[0].offsetHeight}
$html.removeClass('no-transition')}
switchMode(!1);if(window.matchMedia){window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',(e)=>{const storedState=localStorage.getItem('night-mode');const defaultValue=VLT_NIGHT_MODE.defaultValue;if(!(VLT_NIGHT_MODE.useLocalStorage&&storedState)&&'auto'===defaultValue){switchMode(!1)}})}
$doc.on('click','.js-night-mode-trigger',function(e){e.preventDefault();switchMode()})})(jQuery)