var content_step = "";
var _callback;
var _onError;

function curl_step_0(callback, onError){
	var ep = id("ep").value;
	
	if(ep != ""){
		_callback = callback;
		_onError = onError;
		var xhr = new XMLHttpRequest();
		xhr.open('get', 'http://www.dragon-ball-super-streaming.org/dragon-ball-super-episode-'+ep+'-vostfr');
		xhr.onreadystatechange = function() {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState == DONE) {
				if (xhr.status == OK) {
					content_step = xhr.responseText; // 'This is the returned text.'
					curl_step_1(_callback);
				} else {
					_onError(xhr.status);
				}
			}
			else{
				console.log('Error: readyState: '+xhr.readyState);
			}
		};
		xhr.send();
	}
	else{
		onError(-1);
	}
}

function curl_step_1(callback){
	var v = true;
	
	var medias = {
		"daylimotion": {
			"reg" : /video\/([a-z0-9A-Z])+/,
			"part_url" : "http://www.dailymotion.com/embed/",
			"title" : "Daylimotion (Embed) Streaming"
		},
		"rutube": {
			"reg" : /rutube\.ru(\/play)?\/embed\/([a-z0-9A-Z]+\/\?p=[\-a-z0-9A-Z_]+)/,
			"part_url" : "https://",
			"title" : "Rutube (Embed) Streaming"
		},
		"crowdstream": {
			"reg" : /crowdstream\.video\/play\/([a-z0-9A-Z])+/,
			"part_url" : "http://embed.",
			"title" : "Crowdstream (Embed) Streaming"
		},
		"ok":{
			"reg": /ok\.ru\/videoembed\/([0-9]+)/,
			"part_url": "https://",
			"title": "Ok.ru (Embed) Streaming"
		}
	};
	
	for(var i in medias){
		
		if(content_step.match(medias[i]['reg'])!=null){
			var url = content_step.match(medias[i]['reg'])[0];
			callback(medias[i]['part_url']+url, medias[i]['title']);
			v = false;
		}
	}
	
	if(v){
		_onError(0);
	}
	
}

function id(s){
	return document.getElementById(s);
}

function getLinks(){
	id("links").innerHTML = "";
	var cb = function(url, title){
		var lk = document.createElement("a");
		lk.href = url;
		lk.className = "link";
		lk.innerHTML = title+" - Dragon Ball Super "+id("ep").value;
		lk.onclick = function(){
			chrome.tabs.create({ url:this.href });
		};
		id("links").appendChild(lk);
	};
	
	var err = function(e){
		PictFail = "<img class='fail' src='fail.png' alt='Une erreur s\'est produite' title='Une erreur s\'est produite'/>";
		if(e == -1){
			id("links").innerHTML = PictFail+"<div class='err'>Vous devez entrer un numéro d'épisode (Exemple: 102)</div>";
		}
		else if(e == 0){
			id("links").innerHTML = PictFail+"<div class='err'>L'algorithme ne détecte pas de liens.</div>";
		}
		else if(e == 404){
			id("links").innerHTML = PictFail+"<div class='err'>L'épisode "+id("ep").value+" n'est malheuresement pas disponible.</div>";
		}
	}
	curl_step_0(cb, err);
}

id("getbutton").onclick = getLinks;

id("website").onclick = function(){newtab(this.getAttribute("tab-href"));};

function newtab(href){
	chrome.tabs.create({ url: href });
};