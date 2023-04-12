function render(canvas, ctx) {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.onload = (_) => {
	const canvas = document.getElementById("editor");
	// const ctx = canvas.getContext("2d");
	const editor = document.getElementById("source");
	function update() {
		const source = editor.innerText;
		// console.log(source)
		canvas.innerHTML = source;
	};
	editor.addEventListener("input", update);
	let lastRender = 0;
	function loop(now) {
		window.requestAnimationFrame(loop);
		const deltaTime = now - lastRender;
		render(canvas, ctx);
		lastRender = now;
	}
	update();
	// loop(lastRender);
};
