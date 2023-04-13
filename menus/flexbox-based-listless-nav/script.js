window.addEventListener("load", _ => {
	console.log("fullscreen");
	for (const fullscreenButton of document.querySelectorAll("button.fullscreen")) {
		fullscreenButton.onclick = _ => {
			fullscreenButton.parentElement.children[0].requestFullscreen();
		}
	}
});
