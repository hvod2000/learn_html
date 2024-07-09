function fullscreen() {
	let element = document.getElementsByClassName("fullscreen")[0];
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		element.requestFullscreen();
	}
}

document.addEventListener(
	"keydown",
	(e) => {
		if (e.key === "Enter") {
			fullscreen();
		}
	},
	false,
);

