const myId = "mgahhhfcaipeipcfalfjafnonaefckdp";
const adblockId = "gighmmpiobklfepjocnamgkkbiglidom";
const sessionsId = "edacconmaakjimmfgnblocblbcdcpbko";
const passId = "hdokiejnpimakedhajhdlcegeplioahd";
const readerId = "eimadpbcbfnmbkopoojfekhnkhdbieeh";
const suspenderId = "klbibkeccnjlkjkiokjodocebajanakg";
const passUrl = "chrome-extension://hdokiejnpimakedhajhdlcegeplioahd/vault.html";
const sessionsUrl = "chrome-extension://edacconmaakjimmfgnblocblbcdcpbko/main.html";
const extensionsUrl = "chrome://extensions/";
var input;
var sessions;
var adblock;
var closeall;
var extensions;
var deletehis;


window.onload = function(){
	input = document.getElementById("pass");
	sessions = document.getElementById("sessions");
	adblock = document.getElementById("adblock");
	reader = document.getElementById("reader");
	closeall = document.getElementById("closeall");
	extensions = document.getElementById("extensions");
	deletehis = document.getElementById("deletehis");
	
	chrome.management.get(sessionsId, function(ext){
		sessions.innerHTML = adjustImg("switch", sessions.innerHTML, ext.enabled);
	});
	
	chrome.management.get(adblockId, function(ext){
		adblock.innerHTML = adjustImg("switch", adblock.innerHTML, ext.enabled);	
	});
	
	chrome.management.get(readerId, function(ext){
		reader.innerHTML = adjustImg("switch", reader.innerHTML, ext.enabled);	
	});
	
	chrome.management.get(passId, function(ext){
		if(ext.enabled){
			input.placeholder = "pass service enabled";
			input.disabled = true;
		}
	});
	
	chrome.management.getAll(function(extensions){
		let enabled = false;
		for(let ext of extensions){
			if(!ext.isApp && ext.enabled && ext.id != adblockId && ext.id != myId && ext.id != suspenderId){
				enabled = true;
				break;
			}
		}
		closeall.innerHTML = adjustImg("cross", closeall.innerHTML, enabled); 
		closeall.disabled = !enabled;
	});
	
	
	if(!input.disabled){		
		input.focus();
		input.addEventListener("input", passAction);
	}else{
		closeall.focus();
	}
	
	adblock.addEventListener("click", function(){
		chrome.management.get(adblockId, function(ext){
			chrome.management.setEnabled(adblockId, !ext.enabled);
		});
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
		});
		window.close();
	});
	
	reader.addEventListener("click", function(){
		chrome.management.get(readerId, function(ext){
			chrome.management.setEnabled(readerId, !ext.enabled);
		});
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
		});
		window.close();
	});
	
	sessions.addEventListener("click", function(){
		chrome.management.get(sessionsId, function(ext){
			chrome.management.setEnabled(sessionsId, !ext.enabled);
			if(!ext.enabled){
				chrome.tabs.create({url: sessionsUrl});
			}
		});
		window.close();
	});
	
	extensions.addEventListener("click", function(){
		chrome.tabs.query({url: extensionsUrl}, tabs => {
			if(tabs.length) {
				chrome.windows.update(tabs[0].windowId, {focused: true});
				chrome.tabs.update(tabs[0].id, {active: true});
			}
			else chrome.tabs.create({url: extensionsUrl});
		});
		window.close();
	});
	
	closeall.addEventListener("click", function(){
		chrome.management.getAll(function(extensions){
			for(let ext of extensions){
				if(!ext.isApp && ext.enabled && ext.id != adblockId && ext.id != myId && ext.id != suspenderId){
					chrome.management.setEnabled(ext.id, false);
				}
			}
		})
		window.close();
	});
	
	deletehis.addEventListener("click", function(){
		chrome.browsingData.removeHistory({});
		chrome.browsingData.removeCache({}, function(){
			deletehis.innerHTML = adjustImg("trash", "history and cache deleted", false);
			deletehis.disabled = true;
		})
	});
}

var checkbutton = function(id, elem){
	chrome.management.get(id, function(ext){
		elem.disabled = ext.enabled;
	});
}

var adjustImg = function(imgName, innerHTML, enabled){
	return (enabled)? '<img src="images/' + imgName + '_enabled.png">' + innerHTML: '<img src="images/' + imgName + '_disabled.png">' + innerHTML;
}

var passAction = function(){
	if(input.value.length > 5){
		window.close();
	}
	
	if(input.value == "3846"){
		input.style.display = "none";
		chrome.management.get(passId, function(ext){
			chrome.management.setEnabled(passId, !ext.enabled);
			if(!ext.enabled){
				chrome.tabs.create({url: passUrl});
			}
		});
	};
}