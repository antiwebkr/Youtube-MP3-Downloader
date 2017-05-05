$(document).ready(function(){
	var socket = io.connect();

	socket.on("err", function(err){
		$(".result").empty();
		$(".result").append("<div class='err'><p>" + err['code'] + "</p></div>");
	});
	socket.on("progress", function(progress){
		$(".result").empty();
		$(".result").append("<div class='err process'><h1>" + progress['percent'] + "%</h1></div>");
	});
	socket.on("success", function(data){
		$(".result").empty();
		$(".result").append("<div class='msg'><h1>Convert Success!</h1><div class='mp3Down'><img src='" + data['thumnail'] + "'><div class='half'><h2>" + data['title'] + "</h2><a href='/Download?down=" + data['filename'] + "'><h3>Download</h3></div>");
	});
	$(".youtubeForm button").enterKey(function(){
		socket.emit("url", {url: $(".youtubeForm input[type='text']").val()});
	});
	$(".youtubeForm button").click(function(){
		socket.emit("url", {url: $(".youtubeForm input[type='text']").val()});
	});
});