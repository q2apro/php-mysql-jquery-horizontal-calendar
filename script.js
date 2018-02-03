$(document).ready(function()
{
	// for region page
	// $("table .wkend").parent('tr').nextAll().addBack().find('td').addClass('bordrleft');
	$('.wkend').each( function() {
		var $tr = $(this).parent();
		var col = $tr.children().index($(this))+1;
		// mark cell above
		$tr.prev().children().eq(col).addClass('bordrleft');
		// mark cell itsefl
		$tr.children().eq(col).addClass('bordrleft');
		// mark all cells below
		$tr.nextAll().find('td:nth-child('+($(this).index()+2)+')').addClass('bordrleft');
	});

	$('.today').each( function() {
		var cellpos = $(this).index()+1;
		var ttr = $(this).parent();
		// th border at the right
		$(this).next().addClass('bordrtoday');
		// mark all cells below today
		// all borders at the left
		ttr.nextAll().find('td:nth-child('+cellpos+')').addClass('bordrtoday');
		// all borders at the right
		ttr.nextAll().find('td:nth-child('+(cellpos+1)+')').addClass('bordrtoday');
		// last cell with border bottom
		ttr.nextAll().last().find('td:nth-child('+cellpos+')').addClass('bordrBTMtoday');
	});

	// mark sa and so in head
	$('.bordered td').each( function() {
		if( $(this).text() == 'Sa' || $(this).text() == 'So' ) {
			$(this).addClass('saso-mark');
		}
	});
	// background color fields for sa and so
	$('.saso-mark').each( function() {
		// mark all cells below
		var cellpos = $(this).index()+1;
   		$(this).parent().nextAll().find('td:nth-child('+cellpos+'):not(:contains("x"))').css('background', 'rgba(200,190,180,0.35)');
	});

	$('#datepicker').Zebra_DatePicker({
		direction: ['2013-01', '2032-12'],
		format: 'Y-m',
		lang_clear_date: '', 
		months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
		offset: [20,250], 
		onSelect: function(view, elements) {
		   window.location.href = '/holidays/?m='+view;
		}
	});
	$('#datepickbtn').click(function(e) {
		e.preventDefault();
		var plugin = $('input#datepicker').data('Zebra_DatePicker');
		if (!$(this).data('dp_visible')) {
			$(this).data('dp_visible', true);
			plugin.show();
		}
		else {
			$(this).data('dp_visible', false);
			plugin.hide();
		}
	});

	$('.bordered td:first-child a').tipsy( {gravity: 'w', fade: false, offset: 5, html:true} );
	$('.bordered tr:first-child td').tipsy( {gravity: 's', fade: false, offset: 5} );
	$('.bordered tr:nth-child(-n+2) td').tipsy( {gravity: 's', fade: false, offset: 5} );
	$('.bordered .free').tipsy( {gravity: 's', fade: false, offset: 5, html:true} );
	$('.today').tipsy( {gravity: 's', fade: false, offset: 5} );
	$('.navpre').tipsy( {gravity: 'w', fade: false, offset: 5} );
	$('.navfwd').tipsy( {gravity: 'w', fade: false, offset: 5} );
	
	$('.tooltipS').tipsy( {gravity: 'n', fade: false, offset: 15} );
	$('.tooltipN').tipsy( {gravity: 's', fade: false, offset: 15} );
	// $('.bordered td span').tipsy( {gravity: 'w', fade: false, offset: 5} );
	
	/* display shortlink if symbol in sharebox is clicked */
	$('.shlink').click( function(e) {
		e.preventDefault();
		// if not yet created
		if( $('.shlinktxt').length==0) {
			var long_url = $('.shlink').attr('href');
			console.log(long_url);
			get_short_url(long_url, function(short_url) {
				// var ahref = $('.shlink').attr('href');
				$('<div class="shlinktxt"><input type="text" value="'+short_url+'"></input></div>').insertAfter('.shtw');
				$('.shlinktxt input').select();
				console.log(short_url);
			});
		}
		else {
			$('.shlinktxt').toggle();
			$('.shlinktxt input').select();
		}
	});
	// open share links in new window
	$('.shfb,.shgp,.shtw').click( function(e) {
		e.preventDefault();
		window.open($(this).attr('href'),'','width=500,height=400');
	});
	
	$('#setDE').click( function() {
		if( $('.t_de').is(':visible') ) {
			$('.t_de').hide();
			$('#setDE').removeClass('germany');
			$('#setDE').addClass('germany_off');
		}
		else {
			$('.t_de').show();
			$('#setDE').removeClass('germany_off');
			$('#setDE').addClass('germany');
		}
		// remember choice in cookie
		if(initdone) {
			setCookie('holidaycook', calcBinFlag(), 60);
		}
	});
	$('#setCH').click( function() {
		if( $('.t_ch').is(':visible') ) {
			$('.t_ch').hide();
			$('#setCH').removeClass('swiss1');
			$('#setCH').addClass('swiss1_off');
		}
		else {
			$('.t_ch').show();
			$('#setCH').removeClass('swiss1_off');
			$('#setCH').addClass('swiss1');
		}
		if(initdone) {
			setCookie('holidaycook', calcBinFlag(), 60);
		}
	});
	$('#setAT').click( function() {
		if( $('.t_at').is(':visible') ) {
			$('.t_at').hide();
			$('#setAT').removeClass('austria');
			$('#setAT').addClass('austria_off');
		}
		else {
			$('.t_at').show();
			$('#setAT').removeClass('austria_off');
			$('#setAT').addClass('austria');
		}
		if(initdone) {
			setCookie('holidaycook', calcBinFlag(), 60);
		}
	});

	$('#changeRegion').click( function() {
		$('#regionsNav').toggle();
		if( $('#regionsNav').is(':visible') ) {
			$('#arrowud').text('▲');
		}
		else {
			$('#arrowud').text('▼');
		}
		
	});
	
	// start clock
	if($('#clock').length>0)
	{
		startTime();		
	}
	
	// keep tr bg-colored if clicked
	$('.bordered tr').click( function() {
		$(this).addClass('tractive').siblings().removeClass('tractive');
	});
	
	/* START up settings, only on main page */
	if($('.holidaysm').length>0) {
		var binflag = getCookie('holidayshd');
		var initdone = false;
		if(binflag) {
			if((binflag&1)==1) {
				$('#setDE').trigger('click');
			}
			if((binflag&2)==2) {
				$('#setCH').trigger('click');
			}
			if((binflag&4)==4) {
				$('#setAT').trigger('click');
			}
		}
		// set variable to true to allow setcookie for click event after startup
		initdone = true;
	}

}); // END JQUERY-ready

/* bitly shortener */
function get_short_url(long_url, func) {
    $.getJSON(
        "https://api.bitly.com/v3/shorten?callback=?", 
        { 
            "format": "json",
            "apiKey": 'R_2366f5a978201ae03a4616ba6ddde0bc',
            "login": 'echteinfachtv',
            "longUrl": long_url
        },
        function(response) {
            func(response.data.url);
        }
    );
}
	
/* simple clock */
function startTime() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	// add a zero in front of numbers<10
	m=checkTime(m);
	document.getElementById('clock').innerHTML=h+':'+m+' Uhr'; //+' ⏰'; // &#x231A;
	t=setTimeout(function(){startTime()},500);
}
function checkTime(i){
	if (i<10){
		i="0" + i;
	}
	return i;
}

function calcBinFlag() {
	var fl_de = $('.t_de').is(':visible') ? 0 : 1;
	var fl_ch = $('.t_ch').is(':visible') ? 0 : 2;
	var fl_at = $('.t_at').is(':visible') ? 0 : 4;
	//console.log(fl_de+" & "+fl_ch+" & "+fl_at);
	//console.log(fl_de | fl_ch | fl_at);
	return (fl_de|fl_ch|fl_at);
}

function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

/* Zebra_DatePicker: a lightweight jQuery date picker plugin | copyright (c) 2011 - 2013 Stefan Gabos http://stefangabos.ro/jquery/zebra-datepicker/ */
(function(c){c.Zebra_DatePicker=function(ga,ha){var ka={always_visible:!1,days:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),days_abbr:!1,direction:0,disabled_dates:!1,enabled_dates:!1,first_day_of_week:1,format:"Y-m-d",inside:!0,lang_clear_date:"Clear date",months:"January February March April May June July August September October November December".split(" "),months_abbr:!1,offset:[5,-5],pair:!1,readonly_element:!0,select_other_months:!1,show_clear_date:0,show_icon:!0,show_other_months:!0, show_select_today:"Today",show_week_number:!1,start_date:!1,strict:!1,view:"days",weekend_days:[0,6],zero_pad:!1,onChange:null,onClear:null,onSelect:null},t,h,w,C,D,G,H,S,T,N,Z,g,q,y,u,p,U,J,K,V,F,$,r,v,aa,O,W,la,ma,na,A,ia,ba,X,ca,oa,a=this;a.settings={};var d=c(ga),ua=function(e){if(!e){a.settings=c.extend({},ka,ha);for(var b in d.data())0===b.indexOf("zdp_")&&(b=b.replace(/^zdp\_/,""),void 0!==ka[b]&&(a.settings[b]=d.data("zdp_"+b)))}a.settings.readonly_element&&d.attr("readonly","readonly");b= {days:["d","j","D"],months:["F","m","M","n","t"],years:["o","Y","y"]};var z=!1,f=!1,k=!1,E=null;for(E in b)c.each(b[E],function(c,b){-1<a.settings.format.indexOf(b)&&("days"==E?z=!0:"months"==E?f=!0:"years"==E&&(k=!0))});A=z&&f&&k?["years","months","days"]:!z&&f&&k?["years","months"]:z||f||!k?z||!f||k?["years","months","days"]:["months"]:["years"];-1==c.inArray(a.settings.view,A)&&(a.settings.view=A[A.length-1]);F=[];V=[];for(var n=0;2>n;n++)b=0===n?a.settings.disabled_dates:a.settings.enabled_dates, c.isArray(b)&&0<b.length&&c.each(b,function(){for(var a=this.split(" "),b=0;4>b;b++){a[b]||(a[b]="*");a[b]=-1<a[b].indexOf(",")?a[b].split(","):Array(a[b]);for(var e=0;e<a[b].length;e++)if(-1<a[b][e].indexOf("-")){var z=a[b][e].match(/^([0-9]+)\-([0-9]+)/);if(null!==z){for(var f=s(z[1]);f<=s(z[2]);f++)-1==c.inArray(f,a[b])&&a[b].push(f+"");a[b].splice(e,1)}}for(e=0;e<a[b].length;e++)a[b][e]=isNaN(s(a[b][e]))?a[b][e]:s(a[b][e])}0===n?F.push(a):V.push(a)});b=new Date;var m=a.settings.reference_date? a.settings.reference_date:d.data("zdp_reference_date")&&void 0!==d.data("zdp_reference_date")?d.data("zdp_reference_date"):b,l,L;v=r=void 0;g=m.getMonth();T=b.getMonth();q=m.getFullYear();N=b.getFullYear();y=m.getDate();Z=b.getDate();if(!0===a.settings.direction)r=m;else if(!1===a.settings.direction)v=m,W=v.getMonth(),O=v.getFullYear(),aa=v.getDate();else if(!c.isArray(a.settings.direction)&&Y(a.settings.direction)&&0<s(a.settings.direction)||c.isArray(a.settings.direction)&&((l=da(a.settings.direction[0]))|| !0===a.settings.direction[0]||Y(a.settings.direction[0])&&0<a.settings.direction[0])&&((L=da(a.settings.direction[1]))||!1===a.settings.direction[1]||Y(a.settings.direction[1])&&0<=a.settings.direction[1]))r=l?l:new Date(q,g,y+(c.isArray(a.settings.direction)?s(!0===a.settings.direction[0]?0:a.settings.direction[0]):s(a.settings.direction))),g=r.getMonth(),q=r.getFullYear(),y=r.getDate(),L&&+L>=+r?v=L:!L&&!1!==a.settings.direction[1]&&c.isArray(a.settings.direction)&&(v=new Date(q,g,y+s(a.settings.direction[1]))), v&&(W=v.getMonth(),O=v.getFullYear(),aa=v.getDate());else if(!c.isArray(a.settings.direction)&&Y(a.settings.direction)&&0>s(a.settings.direction)||c.isArray(a.settings.direction)&&(!1===a.settings.direction[0]||Y(a.settings.direction[0])&&0>a.settings.direction[0])&&((l=da(a.settings.direction[1]))||Y(a.settings.direction[1])&&0<=a.settings.direction[1]))v=new Date(q,g,y+(c.isArray(a.settings.direction)?s(!1===a.settings.direction[0]?0:a.settings.direction[0]):s(a.settings.direction))),W=v.getMonth(), O=v.getFullYear(),aa=v.getDate(),l&&+l<+v?r=l:!l&&c.isArray(a.settings.direction)&&(r=new Date(O,W,aa-s(a.settings.direction[1]))),r&&(g=r.getMonth(),q=r.getFullYear(),y=r.getDate());else if(c.isArray(a.settings.disabled_dates)&&0<a.settings.disabled_dates.length)for(var P in F)if("*"==F[P][0]&&"*"==F[P][1]&&"*"==F[P][2]&&"*"==F[P][3]){var fa=[];c.each(V,function(){"*"!=this[2][0]&&fa.push(parseInt(this[2][0]+("*"==this[1][0]?"12":x(this[1][0],2))+("*"==this[0][0]?"*"==this[1][0]?"31":(new Date(this[2][0], this[1][0],0)).getDate():x(this[0][0],2)),10))});fa.sort();if(0<fa.length){var Q=(fa[0]+"").match(/([0-9]{4})([0-9]{2})([0-9]{2})/);q=parseInt(Q[1],10);g=parseInt(Q[2],10)-1;y=parseInt(Q[3],10)}break}if(B(q,g,y)){for(;B(q);)r?(q++,g=0):(q--,g=11);for(;B(q,g);)r?(g++,y=1):(g--,y=(new Date(q,g+1,0)).getDate()),11<g?(q++,g=0,y=1):0>g&&(q--,g=11,y=(new Date(q,g+1,0)).getDate());for(;B(q,g,y);)r?y++:y--,b=new Date(q,g,y),q=b.getFullYear(),g=b.getMonth(),y=b.getDate();b=new Date(q,g,y);q=b.getFullYear(); g=b.getMonth();y=b.getDate()}(l=da(d.val()||(a.settings.start_date?a.settings.start_date:"")))&&a.settings.strict&&B(l.getFullYear(),l.getMonth(),l.getDate())&&d.val("");pa(l);if(!a.settings.always_visible&&(e||(a.settings.show_icon?("firefox"==M.name&&d.is('input[type="text"]')&&"inline"==d.css("display")&&d.css("display","inline-block"),l=jQuery('<span class="Zebra_DatePicker_Icon_Wrapper"></span>').css({display:d.css("display"),position:"static"==d.css("position")?"relative":d.css("position"), "float":d.css("float"),top:d.css("top"),right:d.css("right"),bottom:d.css("bottom"),left:d.css("left")}),d.wrap(l).css({position:"relative",top:"auto",right:"auto",bottom:"auto",left:"auto"}),w=jQuery('<button type="button" class="Zebra_DatePicker_Icon'+("disabled"==d.attr("disabled")?" Zebra_DatePicker_Icon_Disabled":"")+'">Pick a date</button>'),a.icon=w,ia=w.add(d)):ia=d,ia.bind("click",function(b){b.preventDefault();d.attr("disabled")||("none"!=h.css("display")?a.hide():a.show())}),void 0!==w&& w.insertAfter(d)),void 0!==w)){w.attr("style","");a.settings.inside&&w.addClass("Zebra_DatePicker_Icon_Inside");l=d.outerWidth();L=d.outerHeight();P=parseInt(d.css("marginLeft"),10)||0;b=parseInt(d.css("marginTop"),10)||0;var m=w.outerWidth(),qa=w.outerHeight(),xa=parseInt(w.css("marginLeft"),10)||0,ya=parseInt(w.css("marginRight"),10)||0;a.settings.inside?w.css({top:b+(L-qa)/2,left:P+(l-m-ya)}):w.css({top:b+(L-qa)/2,left:P+l+xa})}ca=!1!==a.settings.show_select_today&&-1<c.inArray("days",A)&&!B(N, T,Z)?a.settings.show_select_today:!1;e||(c(window).bind("resize",ra),h=c('<div class="Zebra_DatePicker"><table class="dp_header"><tr><td class="dp_previous">&#171;</td><td class="dp_caption">&#032;</td><td class="dp_next">&#187;</td></tr></table><table class="dp_daypicker"></table><table class="dp_monthpicker"></table><table class="dp_yearpicker"></table><table class="dp_footer"><tr><td class="dp_today"'+(!1!==a.settings.show_clear_date?' style="width:50%"':"")+">"+ca+'</td><td class="dp_clear"'+ (!1!==ca?' style="width:50%"':"")+">"+a.settings.lang_clear_date+"</td></tr></table></div>"),a.datepicker=h,C=c("table.dp_header",h),D=c("table.dp_daypicker",h),G=c("table.dp_monthpicker",h),H=c("table.dp_yearpicker",h),X=c("table.dp_footer",h),ba=c("td.dp_today",X),S=c("td.dp_clear",X),a.settings.always_visible?d.attr("disabled")||(a.settings.always_visible.append(h),a.show()):c("body").append(h),h.delegate("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_blocked, .dp_week_number)", "mouseover",function(){c(this).addClass("dp_hover")}).delegate("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_blocked, .dp_week_number)","mouseout",function(){c(this).removeClass("dp_hover")}),za(c("td",C)),c(".dp_previous",C).bind("click",function(){c(this).hasClass("dp_blocked")||("months"==t?p--:"years"==t?p-=12:0>--u&&(u=11,p--),R())}),c(".dp_caption",C).bind("click",function(){t="days"==t?-1<c.inArray("months",A)?"months":-1<c.inArray("years",A)?"years":"days":"months"==t? -1<c.inArray("years",A)?"years":-1<c.inArray("days",A)?"days":"months":-1<c.inArray("days",A)?"days":-1<c.inArray("months",A)?"months":"years";R()}),c(".dp_next",C).bind("click",function(){c(this).hasClass("dp_blocked")||("months"==t?p++:"years"==t?p+=12:12==++u&&(u=0,p++),R())}),D.delegate("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_week_number)","click",function(){a.settings.select_other_months&&null!==(Q=c(this).attr("class").match(/date\_([0-9]{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/))? ea(Q[1],Q[2]-1,Q[3],"days",c(this)):ea(p,u,s(c(this).html()),"days",c(this))}),G.delegate("td:not(.dp_disabled)","click",function(){var b=c(this).attr("class").match(/dp\_month\_([0-9]+)/);u=s(b[1]);-1==c.inArray("days",A)?ea(p,u,1,"months",c(this)):(t="days",a.settings.always_visible&&d.val(""),R())}),H.delegate("td:not(.dp_disabled)","click",function(){p=s(c(this).html());-1==c.inArray("months",A)?ea(p,1,1,"years",c(this)):(t="months",a.settings.always_visible&&d.val(""),R())}),c(ba).bind("click", function(b){b.preventDefault();ea(N,T,Z,"days",c(".dp_current",D));a.settings.always_visible&&a.show();a.hide()}),c(S).bind("click",function(b){b.preventDefault();d.val("");a.settings.always_visible?(K=J=U=null,c("td.dp_selected",h).removeClass("dp_selected")):p=u=K=J=U=null;a.hide();if(a.settings.onClear&&"function"==typeof a.settings.onClear)a.settings.onClear(d)}),a.settings.always_visible||c(document).bind({mousedown:sa,keyup:ta}),R())};a.destroy=function(){void 0!==a.icon&&a.icon.remove();a.datepicker.remove(); c(document).unbind("keyup",ta);c(document).unbind("mousedown",sa);c(window).unbind("resize",ra);d.removeData("Zebra_DatePicker");delete a};a.hide=function(){a.settings.always_visible||(va("hide"),h.hide())};a.show=function(){t=a.settings.view;var e=da(d.val()||(a.settings.start_date?a.settings.start_date:""));e?(J=e.getMonth(),u=e.getMonth(),K=e.getFullYear(),p=e.getFullYear(),U=e.getDate(),B(K,J,U)&&(a.settings.strict&&d.val(""),u=g,p=q)):(u=g,p=q);R();if(a.settings.always_visible)h.show();else{var e= h.outerWidth(),b=h.outerHeight(),z=(void 0!==w?w.offset().left+w.outerWidth(!0):d.offset().left+d.outerWidth(!0))+a.settings.offset[0],f=(void 0!==w?w.offset().top:d.offset().top)-b+a.settings.offset[1],k=c(window).width(),E=c(window).height(),n=c(window).scrollTop(),m=c(window).scrollLeft();z+e>m+k&&(z=m+k-e);z<m&&(z=m);f+b>n+E&&(f=n+E-b);f<n&&(f=n);h.css({left:z,top:f});h.fadeIn("explorer"==M.name&&9>M.version?0:150,"linear");va()}};a.update=function(e){a.original_direction&&(a.original_direction= a.direction);a.settings=c.extend(a.settings,e);ua(!0)};var da=function(e){e+="";if(""!==c.trim(e)){for(var b=a.settings.format.replace(/([-.,*+?^${}()|[\]\/\\])/g,"\\$1"),z="dDjlNSwFmMnYy".split(""),f=[],k=[],E=null,n=null,m=0;m<z.length;m++)-1<(E=b.indexOf(z[m]))&&f.push({character:z[m],position:E});f.sort(function(a,b){return a.position-b.position});c.each(f,function(a,b){switch(b.character){case "d":k.push("0[1-9]|[12][0-9]|3[01]");break;case "D":k.push("[a-z]{3}");break;case "j":k.push("[1-9]|[12][0-9]|3[01]"); break;case "l":k.push("[a-z]+");break;case "N":k.push("[1-7]");break;case "S":k.push("st|nd|rd|th");break;case "w":k.push("[0-6]");break;case "F":k.push("[a-z]+");break;case "m":k.push("0[1-9]|1[012]+");break;case "M":k.push("[a-z]{3}");break;case "n":k.push("[1-9]|1[012]");break;case "Y":k.push("[0-9]{4}");break;case "y":k.push("[0-9]{2}")}});if(k.length&&(f.reverse(),c.each(f,function(a,c){b=b.replace(c.character,"("+k[k.length-a-1]+")")}),k=RegExp("^"+b+"$","ig"),n=k.exec(e))){e=new Date;var l= e.getDate(),d=e.getMonth()+1,p=e.getFullYear(),g="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),h="January February March April May June July August September October November December".split(" "),q,u=!0;f.reverse();c.each(f,function(b,e){if(!u)return!0;switch(e.character){case "m":case "n":d=s(n[b+1]);break;case "d":case "j":l=s(n[b+1]);break;case "D":case "l":case "F":case "M":q="D"==e.character||"l"==e.character?a.settings.days:a.settings.months;u=!1;c.each(q,function(a, c){if(u)return!0;if(n[b+1].toLowerCase()==c.substring(0,"D"==e.character||"M"==e.character?3:c.length).toLowerCase()){switch(e.character){case "D":n[b+1]=g[a].substring(0,3);break;case "l":n[b+1]=g[a];break;case "F":n[b+1]=h[a];d=a+1;break;case "M":n[b+1]=h[a].substring(0,3),d=a+1}u=!0}});break;case "Y":p=s(n[b+1]);break;case "y":p="19"+s(n[b+1])}});if(u&&(f=new Date(p,(d||1)-1,l||1),f.getFullYear()==p&&f.getDate()==(l||1)&&f.getMonth()==(d||1)-1))return f}return!1}},za=function(a){"firefox"==M.name? a.css("MozUserSelect","none"):"explorer"==M.name?a.bind("selectstart",function(){return!1}):a.mousedown(function(){return!1})},wa=function(){var e=(new Date(p,u+1,0)).getDate(),b=(new Date(p,u,1)).getDay(),z=(new Date(p,u,0)).getDate(),b=b-a.settings.first_day_of_week,b=0>b?7+b:b;ja(a.settings.months[u]+", "+p);var f="<tr>";a.settings.show_week_number&&(f+="<th>"+a.settings.show_week_number+"</th>");for(var k=0;7>k;k++)f+="<th>"+(c.isArray(a.settings.days_abbr)&&void 0!==a.settings.days_abbr[(a.settings.first_day_of_week+ k)%7]?a.settings.days_abbr[(a.settings.first_day_of_week+k)%7]:a.settings.days[(a.settings.first_day_of_week+k)%7].substr(0,2))+"</th>";f+="</tr><tr>";for(k=0;42>k;k++){0<k&&0===k%7&&(f+="</tr><tr>");if(0===k%7&&a.settings.show_week_number){var d=new Date(p,u,k-b+1),n=d.getFullYear(),m=d.getMonth()+1,d=d.getDate(),l=void 0,g=void 0,h=void 0,s=h=void 0,q=void 0,h=g=l=void 0;3>m?(l=n-1,g=(l/4|0)-(l/100|0)+(l/400|0),h=((l-1)/4|0)-((l-1)/100|0)+((l-1)/400|0),h=g-h,s=0,q=d-1+31*(m-1)):(l=n,g=(l/4|0)-(l/ 100|0)+(l/400|0),h=((l-1)/4|0)-((l-1)/100|0)+((l-1)/400|0),h=g-h,s=h+1,q=d+((153*(m-3)+2)/5|0)+58+h);l=(l+g)%7;d=(q+l-s)%7;g=q+3-d;h=0>g?53-((l-h)/5|0):g>364+h?1:(g/7|0)+1;f+='<td class="dp_week_number">'+h+"</td>"}n=k-b+1;if(a.settings.select_other_months&&(k<b||n>e))var r=new Date(p,u,n),v=r.getFullYear(),t=r.getMonth(),w=r.getDate(),r=v+x(t+1,2)+x(w,2);k<b?f+='<td class="'+(a.settings.select_other_months&&!B(v,t,w)?"dp_not_in_month_selectable date_"+r:"dp_not_in_month")+'">'+(a.settings.select_other_months|| a.settings.show_other_months?x(z-b+k+1,a.settings.zero_pad?2:0):"&nbsp;")+"</td>":n>e?f+='<td class="'+(a.settings.select_other_months&&!B(v,t,w)?"dp_not_in_month_selectable date_"+r:"dp_not_in_month")+'">'+(a.settings.select_other_months||a.settings.show_other_months?x(n-e,a.settings.zero_pad?2:0):"&nbsp;")+"</td>":(m=(a.settings.first_day_of_week+k)%7,d="",B(p,u,n)?(d=-1<c.inArray(m,a.settings.weekend_days)?"dp_weekend_disabled":d+" dp_disabled",u==T&&p==N&&Z==n&&(d+=" dp_disabled_current")):(-1< c.inArray(m,a.settings.weekend_days)&&(d="dp_weekend"),u==J&&p==K&&U==n&&(d+=" dp_selected"),u==T&&p==N&&Z==n&&(d+=" dp_current")),f+="<td"+(""!==d?' class="'+c.trim(d)+'"':"")+">"+(a.settings.zero_pad?x(n,2):n)+"</td>")}D.html(c(f+"</tr>"));a.settings.always_visible&&(la=c("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_blocked, .dp_week_number)",D));D.show()},Aa=function(){ja(p);for(var e="<tr>",b=0;12>b;b++){0<b&&0===b%3&&(e+="</tr><tr>");var d="dp_month_"+b;B(p,b)?d+=" dp_disabled": !1!==J&&J==b?d+=" dp_selected":T==b&&N==p&&(d+=" dp_current");e+='<td class="'+c.trim(d)+'">'+(c.isArray(a.settings.months_abbr)&&void 0!==a.settings.months_abbr[b]?a.settings.months_abbr[b]:a.settings.months[b].substr(0,3))+"</td>"}G.html(c(e+"</tr>"));a.settings.always_visible&&(ma=c("td:not(.dp_disabled)",G));G.show()},Ba=function(){ja(p-7+" - "+(p+4));for(var e="<tr>",b=0;12>b;b++){0<b&&0===b%3&&(e+="</tr><tr>");var d="";B(p-7+b)?d+=" dp_disabled":K&&K==p-7+b?d+=" dp_selected":N==p-7+b&&(d+=" dp_current"); e+="<td"+(""!==c.trim(d)?' class="'+c.trim(d)+'"':"")+">"+(p-7+b)+"</td>"}H.html(c(e+"</tr>"));a.settings.always_visible&&(na=c("td:not(.dp_disabled)",H));H.show()},va=function(a){if("explorer"==M.name&&6==M.version){if(!$){var b=s(h.css("zIndex"))-1;$=jQuery("<iframe>",{src:'javascript:document.write("")',scrolling:"no",frameborder:0,allowtransparency:"true",css:{zIndex:b,position:"absolute",top:-1E3,left:-1E3,width:h.outerWidth(),height:h.outerHeight(),filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)", display:"none"}});c("body").append($)}switch(a){case "hide":$.hide();break;default:a=h.offset(),$.css({top:a.top,left:a.left,display:"block"})}}},B=function(e,b,d){if((void 0===e||isNaN(e))&&(void 0===b||isNaN(b))&&(void 0===d||isNaN(d)))return!1;if(c.isArray(a.settings.direction)||0!==s(a.settings.direction)){var f=s(I(e,"undefined"!=typeof b?x(b,2):"","undefined"!=typeof d?x(d,2):"")),k=(f+"").length;if(8==k&&("undefined"!=typeof r&&f<s(I(q,x(g,2),x(y,2)))||"undefined"!=typeof v&&f>s(I(O,x(W,2), x(aa,2))))||6==k&&("undefined"!=typeof r&&f<s(I(q,x(g,2)))||"undefined"!=typeof v&&f>s(I(O,x(W,2))))||4==k&&("undefined"!=typeof r&&f<q||"undefined"!=typeof v&&f>O))return!0}"undefined"!=typeof b&&(b+=1);var h=!1,n=!1;F&&c.each(F,function(){if(!h&&(-1<c.inArray(e,this[2])||-1<c.inArray("*",this[2]))&&("undefined"!=typeof b&&-1<c.inArray(b,this[1])||-1<c.inArray("*",this[1]))&&("undefined"!=typeof d&&-1<c.inArray(d,this[0])||-1<c.inArray("*",this[0]))){if("*"==this[3])return h=!0;var a=(new Date(e, b-1,d)).getDay();if(-1<c.inArray(a,this[3]))return h=!0}});V&&c.each(V,function(){if(!n&&(-1<c.inArray(e,this[2])||-1<c.inArray("*",this[2]))&&(n=!0,"undefined"!=typeof b))if(n=!0,-1<c.inArray(b,this[1])||-1<c.inArray("*",this[1])){if("undefined"!=typeof d){n=!0;if(-1<c.inArray(d,this[0])||-1<c.inArray("*",this[0])){if("*"==this[3])return n=!0;var a=(new Date(e,b-1,d)).getDay();if(-1<c.inArray(a,this[3]))return n=!0}n=!1}}else n=!1});return V&&n||!F||!h?!1:!0},Y=function(a){return(a+"").match(/^\-?[0-9]+$/)? !0:!1},ja=function(e){c(".dp_caption",C).html(e);if(c.isArray(a.settings.direction)||0!==s(a.settings.direction)||1==A.length&&"months"==A[0]){e=p;var b=u,d,f;if("days"==t)f=!B(0>b-1?I(e-1,"11"):I(e,x(b-1,2))),d=!B(11<b+1?I(e+1,"00"):I(e,x(b+1,2)));else if("months"==t){if(!r||r.getFullYear()<=e-1)f=!0;if(!v||v.getFullYear()>=e+1)d=!0}else if("years"==t){if(!r||r.getFullYear()<e-7)f=!0;if(!v||v.getFullYear()>e+4)d=!0}f?c(".dp_previous",C).removeClass("dp_blocked"):(c(".dp_previous",C).addClass("dp_blocked"), c(".dp_previous",C).removeClass("dp_hover"));d?c(".dp_next",C).removeClass("dp_blocked"):(c(".dp_next",C).addClass("dp_blocked"),c(".dp_next",C).removeClass("dp_hover"))}},R=function(){if(""===D.text()||"days"==t){if(""===D.text()){a.settings.always_visible||h.css("left",-1E3);h.show();wa();var e=D.outerWidth(),b=D.outerHeight();G.css({width:e,height:b});H.css({width:e,height:b});C.css("width",e);X.css("width",e);h.hide()}else wa();G.hide();H.hide()}else"months"==t?(Aa(),D.hide(),H.hide()):"years"== t&&(Ba(),D.hide(),G.hide());a.settings.onChange&&"function"==typeof a.settings.onChange&&void 0!==t&&(e="days"==t?D.find("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_blocked)"):"months"==t?G.find("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_blocked)"):H.find("td:not(.dp_disabled, .dp_weekend_disabled, .dp_not_in_month, .dp_blocked)"),e.each(function(){if("days"==t)if(c(this).hasClass("dp_not_in_month_selectable")){var a=c(this).attr("class").match(/date\_([0-9]{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/); c(this).data("date",a[1]+"-"+a[2]+"-"+a[3])}else c(this).data("date",p+"-"+x(u+1,2)+"-"+x(s(c(this).text()),2));else"months"==t?(a=c(this).attr("class").match(/dp\_month\_([0-9]+)/),c(this).data("date",p+"-"+x(s(a[1])+1,2))):c(this).data("date",s(c(this).text()))}),a.settings.onChange(t,e,d));X.show();!0===a.settings.show_clear_date||0===a.settings.show_clear_date&&""!==d.val()||a.settings.always_visible&&!1!==a.settings.show_clear_date?(S.show(),ca?(ba.css("width","50%"),S.css("width","50%")):(ba.hide(), S.css("width","100%"))):(S.hide(),ca?ba.show().css("width","100%"):X.hide())},ea=function(e,b,h,f,k){var g=new Date(e,b,h,12,0,0),n="days"==f?la:"months"==f?ma:na,m;m="";for(var l=g.getDate(),q=g.getDay(),s=a.settings.days[q],r=g.getMonth()+1,v=a.settings.months[r-1],t=g.getFullYear()+"",w=0;w<a.settings.format.length;w++){var y=a.settings.format.charAt(w);switch(y){case "y":t=t.substr(2);case "Y":m+=t;break;case "m":r=x(r,2);case "n":m+=r;break;case "M":v=c.isArray(a.settings.months_abbr)&&void 0!== a.settings.months_abbr[r-1]?a.settings.months_abbr[r-1]:a.settings.months[r-1].substr(0,3);case "F":m+=v;break;case "d":l=x(l,2);case "j":m+=l;break;case "D":s=c.isArray(a.settings.days_abbr)&&void 0!==a.settings.days_abbr[q]?a.settings.days_abbr[q]:a.settings.days[q].substr(0,3);case "l":m+=s;break;case "N":q++;case "w":m+=q;break;case "S":m=1==l%10&&"11"!=l?m+"st":2==l%10&&"12"!=l?m+"nd":3==l%10&&"13"!=l?m+"rd":m+"th";break;default:m+=y}}d.val(m);a.settings.always_visible&&(J=g.getMonth(),u=g.getMonth(), K=g.getFullYear(),p=g.getFullYear(),U=g.getDate(),n.removeClass("dp_selected"),k.addClass("dp_selected"),"days"==f&&k.hasClass("dp_not_in_month_selectable")&&a.show());a.hide();pa(g);if(a.settings.onSelect&&"function"==typeof a.settings.onSelect)a.settings.onSelect(m,e+"-"+x(b+1,2)+"-"+x(h,2),g,d);d.focus()},I=function(){for(var a="",b=0;b<arguments.length;b++)a+=arguments[b]+"";return a},x=function(a,b){for(a+="";a.length<b;)a="0"+a;return a},s=function(a){return parseInt(a,10)},pa=function(e){a.settings.pair&& c.each(a.settings.pair,function(){var a=c(this);a.data&&a.data("Zebra_DatePicker")?(a=a.data("Zebra_DatePicker"),a.update({reference_date:e,direction:0===a.settings.direction?1:a.settings.direction}),a.settings.always_visible&&a.show()):a.data("zdp_reference_date",e)})},ta=function(c){"block"!=h.css("display")&&27!=c.which||a.hide()},sa=function(e){if("block"==h.css("display")){if(a.settings.show_icon&&c(e.target).get(0)===w.get(0))return!0;0===c(e.target).parents().filter(".Zebra_DatePicker").length&& a.hide()}},ra=function(){a.hide();void 0!==w&&(clearTimeout(oa),oa=setTimeout(function(){a.update()},100))},M={init:function(){this.name=this.searchString(this.dataBrowser)||"";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||""},searchString:function(a){for(var b=0;b<a.length;b++){var c=a[b].string,d=a[b].prop;this.versionSearchString=a[b].versionSearch||a[b].identity;if(c){if(-1!=c.indexOf(a[b].subString))return a[b].identity}else if(d)return a[b].identity}}, searchVersion:function(a){var b=a.indexOf(this.versionSearchString);if(-1!=b)return parseFloat(a.substring(b+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Firefox",identity:"firefox"},{string:navigator.userAgent,subString:"MSIE",identity:"explorer",versionSearch:"MSIE"}]};M.init();ua()};c.fn.Zebra_DatePicker=function(ga){return this.each(function(){void 0!==c(this).data("Zebra_DatePicker")&&c(this).data("Zebra_DatePicker").destroy();var ha=new c.Zebra_DatePicker(this, ga);c(this).data("Zebra_DatePicker",ha)})}})(jQuery);
// tipsy, facebook style tooltips for jquery, version 1.0.0a, (c) 2008-2010 jason frame [jason@onehackoranother.com], released under the MIT license
(function($){function maybeCall(thing,ctx){return typeof thing=="function"?thing.call(ctx):thing}function Tipsy(element,options){this.$element=$(element);this.options=options;this.enabled=true;this.fixTitle()}Tipsy.prototype={show:function(){var title=this.getTitle();if(title&&this.enabled){var $tip=this.tip();$tip.find(".tipsy-inner")[this.options.html?"html":"text"](title);$tip[0].className="tipsy";$tip.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).prependTo(document.body);var pos=
$.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight});var actualWidth=$tip[0].offsetWidth,actualHeight=$tip[0].offsetHeight,gravity=maybeCall(this.options.gravity,this.$element[0]);var tp;switch(gravity.charAt(0)){case "n":tp={top:pos.top+pos.height+this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case "s":tp={top:pos.top-actualHeight-this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case "e":tp={top:pos.top+
pos.height/2-actualHeight/2,left:pos.left-actualWidth-this.options.offset};break;case "w":tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width+this.options.offset};break}if(gravity.length==2)if(gravity.charAt(1)=="w")tp.left=pos.left+pos.width/2-15;else tp.left=pos.left+pos.width/2-actualWidth+15;$tip.css(tp).addClass("tipsy-"+gravity);$tip.find(".tipsy-arrow")[0].className="tipsy-arrow tipsy-arrow-"+gravity.charAt(0);if(this.options.className)$tip.addClass(maybeCall(this.options.className,
this.$element[0]));if(this.options.fade)$tip.stop().css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:this.options.opacity});else $tip.css({visibility:"visible",opacity:this.options.opacity})}},hide:function(){if(this.options.fade)this.tip().stop().fadeOut(function(){$(this).remove()});else this.tip().remove()},fixTitle:function(){var $e=this.$element;if($e.attr("title")||typeof $e.attr("original-title")!="string")$e.attr("original-title",$e.attr("title")||"").removeAttr("title").attr("title", "");},
getTitle:function(){var title,$e=this.$element,o=this.options;this.fixTitle();var title,o=this.options;if(typeof o.title=="string")title=$e.attr(o.title=="title"?"original-title":o.title);else if(typeof o.title=="function")title=o.title.call($e[0]);title=(""+title).replace(/(^\s*|\s*$)/,"");return title||o.fallback},tip:function(){if(!this.$tip)this.$tip=$('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');return this.$tip},validate:function(){if(!this.$element[0].parentNode){this.hide();
this.$element=null;this.options=null}},enable:function(){this.enabled=true},disable:function(){this.enabled=false},toggleEnabled:function(){this.enabled=!this.enabled}};$.fn.tipsy=function(options){if(options===true)return this.data("tipsy");else if(typeof options=="string"){var tipsy=this.data("tipsy");if(tipsy)tipsy[options]();return this}options=$.extend({},$.fn.tipsy.defaults,options);function get(ele){var tipsy=$.data(ele,"tipsy");if(!tipsy){tipsy=new Tipsy(ele,$.fn.tipsy.elementOptions(ele,
options));$.data(ele,"tipsy",tipsy)}return tipsy}function enter(){var tipsy=get(this);tipsy.hoverState="in";if(options.delayIn==0)tipsy.show();else{tipsy.fixTitle();setTimeout(function(){if(tipsy.hoverState=="in")tipsy.show()},options.delayIn)}}function leave(){var tipsy=get(this);tipsy.hoverState="out";if(options.delayOut==0)tipsy.hide();else setTimeout(function(){if(tipsy.hoverState=="out")tipsy.hide()},options.delayOut)}if(!options.live)this.each(function(){get(this)});if(options.trigger!="manual"){var binder=
options.live?"live":"bind",eventIn=options.trigger=="hover"?"mouseenter":"focus",eventOut=options.trigger=="hover"?"mouseleave":"blur";this[binder](eventIn,enter)[binder](eventOut,leave)}return this};$.fn.tipsy.defaults={className:null,delayIn:0,delayOut:0,fade:false,fallback:"",gravity:"n",html:false,live:false,offset:0,opacity:0.8,title:"title",trigger:"hover"};$.fn.tipsy.elementOptions=function(ele,options){return $.metadata?$.extend({},options,$(ele).metadata()):options};$.fn.tipsy.autoNS=function(){return $(this).offset().top>
$(document).scrollTop()+$(window).height()/2?"s":"n"};$.fn.tipsy.autoWE=function(){return $(this).offset().left>$(document).scrollLeft()+$(window).width()/2?"e":"w"};$.fn.tipsy.autoBounds=function(margin,prefer){return function(){var dir={ns:prefer[0],ew:prefer.length>1?prefer[1]:false},boundTop=$(document).scrollTop()+margin,boundLeft=$(document).scrollLeft()+margin,$this=$(this);if($this.offset().top<boundTop)dir.ns="n";if($this.offset().left<boundLeft)dir.ew="w";if($(window).width()+$(document).scrollLeft()-
$this.offset().left<margin)dir.ew="e";if($(window).height()+$(document).scrollTop()-$this.offset().top<margin)dir.ns="s";return dir.ns+(dir.ew?dir.ew:"")}}})(jQuery);
