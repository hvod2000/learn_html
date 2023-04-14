window.addEventListener("load", _ => {
	console.log("fullscreen");
	for (const fullscreenButton of document.querySelectorAll("button.fullscreen")) {
		fullscreenButton.onclick = _ => {
			let target = fullscreenButton.parentElement.children[0];
			target.requestFullscreen();
			// TODO: replace this with normal code
			target.addEventListener("fullscreenchange", _ => {
				if (document.fullscreenElement == target)
					target.focus();
				else
					target.blur();
			});
		}
	}
});
