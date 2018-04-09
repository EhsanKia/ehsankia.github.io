var color1 = '#202020';
var size = 0;

function fade(c1,c2) {
	NLBfadeBg('body',c1,c2,500);
	return c2;
}

function resizeText(multiplier) {
	if(size+multiplier>-3 && size+multiplier<3){
		$('#content_right').css('font-size', parseInt($('#content_right').css('font-size')) + multiplier + "px");
		size+=multiplier;
	}
}

$(document).ready(function() {
	$.address.change(function(event) {
		$(event.value.replace('/','.') ).trigger('changeTo');
	});

	$('ul li a').hover(function() { //mouse in
		jQuery.easing.def = "easeOutQuad";
		$(this).stop().animate({ paddingLeft: '20px'}, 200);
	}, function() { //mouse out
		jQuery.easing.def = "easeOutQuad";
		$(this).stop().animate({ paddingLeft: 0 }, 200);
	});

	$('#links').hide();

	$('#links_b').hover(
		function(){
			if($('#links').css('height')!=='65px'){
				$('#links').hide();
			}
			$('#links').stop().slideDown(1000,'easeOutBounce');
		}, function(){}
	);

	$('#content_left').hover(
		function(){},
		function(){ $('#links').stop().slideUp(1000,'easeOutBounce');}
	);

	$('.home').bind('changeTo', function(){
		if (document.body.className !== "t1"){
			$('#content_right').fadeOut(150, function() { $(this).load('pages/home.html');} ).delay(100).fadeIn(250);
			document.body.className = "t1";
			color1 = fade(color1, '#202020');
			$('li>a').css('color','');
			$('.home').css('color','#e5e5e5');
			$.address.title("Ehsan Kia | Home");
		}
	});

	$('.about').bind('changeTo', function(){
		if (document.body.className !== "t2"){
			$('#content_right').fadeOut(150, function() { $(this).load('pages/about.html');} ).delay(100).fadeIn(250);
			document.body.className = "t2";
			color1 = fade(color1, '#1b2626');
			$('li>a').css('color','');
			$('.about').css('color','#a3e5e5');
			$.address.title("Ehsan Kia | About Me");
		}
	});

	$('.portfolio').bind('changeTo', function(){
		if (document.body.className !== "t3"){
			$('#content_right').fadeOut(150, function() { $(this).load('pages/portfolio.html'); } ).delay(100).fadeIn(250);
			document.body.className = "t3";
			color1 = fade(color1, '#261616');
			$('li>a').css('color','');
			$('.portfolio').css('color','#e5a1a5');
			$.address.title("Ehsan Kia | Portfolio");
		}
	});

	$('.contact').bind('changeTo', function(){
		if (document.body.className !== "t4"){
			$('#content_right').fadeOut(150, function() { $(this).load('pages/contact.html');} ).delay(100).fadeIn(250);
			document.body.className = "t4";
			color1 = fade(color1, '#211b26');
			$('li>a').css('color','');
			$('.contact').css('color','#c7a1e5');
			$.address.title("Ehsan Kia | Contact Me");
		}
	});

	$('.links').bind('changeTo', function(){
		if (document.body.className !== "t5"){
			$('#content_right').fadeOut(150, function() { $(this).load('pages/links.html');} ).delay(100).fadeIn(250);
			document.body.className = "t5";
			color1 = fade(color1, '#21261b');
			$('li>a').css('color','');
			$('#links_b>a').css('color','#ace5c7');
			$.address.title("Ehsan Kia | Links");
		}
	});
	var pages = ['#home','#about','#portfolio','#contact','#links'];
	if (pages.indexOf(document.location.hash) < 0) {
		document.location.hash = "home";
	}
});
