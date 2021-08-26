;(function (){
	var u = navigator.userAgent,
		w = window.innerWidth;
		
	if (!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf('iPad') > -1) {
		if (w > 640) {
			w = 640;
		}
		window.innerWidth = 750*(w / 750);
		window.onload = function() {
			window.innerWidth = w;
			console.log("log main start")
		}
	}
})();