/*

 MD Share
 (c)2019 Soruto Project.
 
 MIT Licensed.
 
 Required:
 
 	lz-string(https://github.com/pieroxy/lz-string/)(MIT Licensed)
	marked.js(https://github.com/markedjs/marked)(MIT Licensed)
 
*/
//marked.js config
;
(function () {
	var renderer = new marked.Renderer()
	renderer.code = function (code, language) {
		return '<pre><code class="hljs">' + hljs.highlightAuto(code).value + '</code></pre>';
	};

	marked.setOptions({
		renderer: renderer,
	});
})();
//flags
var flags = {};
flags.edited = false;

var $$ = function (e) {
	var el = document.querySelectorAll(e);
	if (el.length == 1) {
		return el[0];
	} else {
		return el;
	}
}

window.onload = function () {
	//IEを弾く
	if (getBrowserName() == "IE") {
		alert("本Webアプリは、Internet Explorerではご利用いただけません。");
		return false;
	}
	//Get Url Parameters
	var arg = new Object;
	var pair = location.search.substring(1).split('&');
	for (var i = 0; pair[i]; i++) {
		var kv = pair[i].split('=');
		arg[kv[0]] = kv[1];
	}
	if (arg["q"] === undefined || arg["q"] == "") {
		var pageData = "DwQgtBBQDekJACIAuBLJAbApggXAgsgCIAEAygBYCGATpoB4MgEQyBiDIMoMgugwIA08ClArknIB7argSkRAocQAK1IQCtMAYyQJIAX0gQwAPkgBiA8SJkqtSMADOAW0rp0uwPEMgaQZAUQyAQhkCaDIHkGQKMGgIwagEkMgLjygBIMzIBADMAA9Lb2jpCQAFSpScnEgA2mgOoMgCIMgHsMgD8MgPUMgAMMgGUMgM8MgJMMgLUMgKcMgIcMlYATDEGAOvKACEZegNEMgNYMgPYMgIAMkMRjxBkyAMKAdgyALBqAECrDgDAMmYDxkYCwDEHFgFcMgMMMxdmAfgxekaPjGYCdDPmA2wzzS0PLjYDTDPWFG4BJhKubM4BgGX27A7HU4pYiAR0VAJDmgFUGQAxDIB9BkAcwyFFqAGQZABYRgC5PWGAKwZcothgBVABKABlAIsMgEuGRqFQD9DCjAMbW2R8gFoowBZ2rDAGYMuR6LkAXR6AWKjshyfIADBihuTOGUANOYAdUwACNAEUMgHWGHYzQD+8oAKV0AnaaAVZshhTACUMgG6GSqXQLYwCWDANzmNJrN8Y9AltAYcOQLAOYMgFkGE5ncYTYjXO6Op6vd5fZ1-AH7N2en2nM4pNKg2UKlU7Ab4ACSABViCSUMpMAA7KyYGaAaDk+oAbRUA0amc3K+saQbN5gtF0vlwBBloBAyIGgFO5CszQAWDIApBjcHpBumIAEYAHTEFgzQC9DIBVhha5UA5QyKoKABqiPYAghkAhI6AfEUPUfAGxKgAU0vqARyNAMYMHMA9kES5vTuEi7JDQDqIe1AJRWmKjgwgDODFKgCMUYAf1GYkEa4btuMxeIAngwcjMgDgkYAvxFHHCAyALOJPbYoAFwmAGBKfSABhRgCQ8dk2KAIoMMKAA4M2KAJEMuJnNOABMC7tIAoAFYQMv5-lxwywVuip9IARalCsA8q6MAfC6NigDJDIxgA1MYA33JBIABTFOCxsRybE0mQPo06AKj6mqAMKKgBY-8AlDEOQtAAGYALwIOQSBIAADlYOAxDECiUHOADuKAANYoO5mAACYoP5IgAOYxEFoUxK2AD67YlmWCDEEgNCxZgSDOSl8roJQxbBQguitvmhYZZgxBgMQMohWFkXRbElD6NKcpKqqQRar0LDDn0DBuEMVXpZ2MyAKGKgCd2n0gAwKoA8IawnCB4joA-gzYrCTbEJYNl2ZgTkIHOMTkJg6DuTE6A1Z2c6uTY6BZTl1B5QVCBFSVZUVUaprmgEMyAM5RgAMvgMLCAIYMjEuIxgAqDIA5ZGiuK0QxB1QA";
		//グローバル変数
		mdWithInfo = LZString.decompressFromEncodedURIComponent(pageData);
	} else {
		mdWithInfo = LZString.decompressFromEncodedURIComponent(arg["q"]);
		console.log(mdWithInfo);
	}
	//md with document info
	if (mdWithInfo.indexOf("<!---") !== -1) {
		var mdInfo = mdWithInfo.split("<!---")[1].split("--->")[0];
		var md = mdWithInfo.split("--->")[1];
		var mdInfoJson = JSON.parse(mdInfo);
		if (mdInfoJson.title) {
			$$("#docTitle").textContent = mdInfoJson.title;
			document.title = mdInfoJson.title + " - MD Share";
		}
		if (mdInfoJson.author) $$("#author").textContent = "by " + mdInfoJson.author;
	}
	//normal md
	else {
		var mdInfo = "";
		var md = mdWithInfo;
		$$("#docInfo").style.display = "none";
	}
	$$("#doc").innerHTML = marked(md);


	//addEventListener
	$$("#newButton").addEventListener("click", function () {
		$$("#previewCheck").checked = false;
		$$("#preview").style.display = "none";
		$$("#editor").style.display = "block";
		$$("#new").className = $$("#windowBack").className = "show";
		document.body.style.overflow = "hidden";
		$$("#tools").className = "close";
		$$("#saveLink").value = "";
	});

	$$("#editButton").addEventListener("click", function () {
		$$("#previewCheck").checked = false;
		$$("#preview").style.display = "none";
		$$("#editor").style.display = "block";
		$$("#editor").value = mdWithInfo;
		$$("#preview").innerHTML = marked(mdWithInfo);
		$$("#new").className = $$("#windowBack").className = "show";
		$$("#saveLink").value = "";
		document.body.style.overflow = "hidden";
		$$("#tools").className = "close";
	})

	$$("#newWindowClose").addEventListener("click", function () {
		if (flags.edited === true) {
			var conf = confirm("編集内容が破棄されます。\n生成されたURLも削除されます。\n生成されたURLをメモした上で続行してください。\n続行しますか？");
		} else {
			var conf = true;
		}
		if (conf === true) {
			$$("#new").className = $$("#windowBack").className = "";
			$$("#editor").value = "";
			$$("#saveLink").value = "";
			$$("#preview").innerHTML = "";
			document.body.style.overflow = "";

			window.onbeforeunload = function (e) {};
			flags.edited = false;
		}
	});

	$$("#previewCheck").addEventListener("change", function (e) {
		if (e.target.checked === true) {
			$$("#preview").style.display = "block";
			$$("#editor").style.display = "none";
		} else {
			$$("#preview").style.display = "none";
			$$("#editor").style.display = "block";
		}
	});

	$$("#editor").addEventListener("keyup", function () {
		$$("#preview").innerHTML = marked($$("#editor").value);
		window.onbeforeunload = function (e) {
			return "編集内容が破棄されます。続行しますか？";
		};
		flags.edited = true;
	});
	$$('#editor').addEventListener('keydown', function (e) {
		var elem, end, start, value;
		if (e.keyCode === 9) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			elem = e.target;
			start = elem.selectionStart;
			end = elem.selectionEnd;
			value = elem.value;
			elem.value = "" + (value.substring(0, start)) + "\t" + (value.substring(end));
			elem.selectionStart = elem.selectionEnd = start + 1;
			return false;
		}
	});
	$$("#saveLink").addEventListener("click",function(e){
		e.target.select();
	});

	$$("#gen").addEventListener("click", function () {
		if ($$("#editor").value.indexOf("<!---") === -1 || $$("#editor").value.indexOf("--->") === -1) {
			console.log("input user info");
			var title = prompt("このドキュメントのタイトルを入力してください");
			var author = prompt("このドキュメントの作者名を入力してください");
			var updateMd = '<!---\n{\n\t"title":"' + title + '",\n\t"author":"' + author + '"\n}\n--->\n' + $$("#editor").value;
			$$("#editor").value = updateMd;
			var userMd = LZString.compressToEncodedURIComponent($$("#editor").value);
			var genURL = location.protocol + "//" + location.hostname + location.pathname + "?q=" + userMd;
			if (genURL.length > 5000) {
				alert("マークダウンに記述された文字数が多すぎるため、URLの生成をキャンセルしました。\nマークダウンの文字数を減らしたり、内容を2つのマークダウンに記述したりしてください。");
			} else {
				$$("#saveLink").value = genURL;
				console.log(userMd);
			}
		} else {
			var userMd = LZString.compressToEncodedURIComponent($$("#editor").value);
			var genURL = location.protocol + "//" + location.hostname + location.pathname + "?q=" + userMd;
			if (genURL.length > 5000) {
				alert("マークダウンに記述された文字数が多すぎるため、URLの生成をキャンセルしました。\nマークダウンの文字数を減らしたり、内容を2つのマークダウンに記述したりしてください。");
			} else {
				$$("#saveLink").value = genURL;
				console.log(userMd);
			}
		}
	});

	$$("#menuButton").addEventListener("click", function () {
		var now = $$("#tools").className;
		if (now === "close") {
			$$("#tools").className = "";
		} else {
			$$("#tools").className = "close";
		}
	});

	$$("#infoButton").addEventListener("click", function () {
		window.open("./help/index.html");
	});
}

function getBrowserName() {
	var userAgent = window.navigator.userAgent.toLowerCase();

	if (userAgent.indexOf('msie') != -1 ||
		userAgent.indexOf('trident') != -1) {
		return "IE";
	} else if (userAgent.indexOf('edge') != -1) {
		return "Edge";
	} else if (userAgent.indexOf('chrome') != -1) {
		return "Chrome";
	} else if (userAgent.indexOf('safari') != -1) {
		return "Safari";
	} else if (userAgent.indexOf('firefox') != -1) {
		return "Firefox";
	} else if (userAgent.indexOf('opera') != -1) {
		return "Opera";
	} else {
		return "Unknown";
	}
}
