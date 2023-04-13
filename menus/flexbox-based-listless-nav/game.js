window.addEventListener("load", _ => {
	console.log("game");
	for (const canvasContainer of document.querySelectorAll(".game.snake")) {
		canvasContainer.style["aspect-ratio"] = "16/9";
		const cvs = document.createElement("canvas");
		cvs.width = 320;
		cvs.height = 180;
		canvasContainer.prepend(cvs);
		const ctx = cvs.getContext("2d");
		ctx.fillStyle = "#808";
		ctx.fillRect(0, 0, cvs.width, cvs.height);
	}
});
