window.onload = () => {
	document.getElementById("aboba").innerText = visualViewport.width + " x " +
		visualViewport.height;
	const aboba = document.getElementById("aboba");
	console.log("hea");
	setInterval(() => {
		document.getElementById("aboba").innerText = visualViewport.width +
			" x " + visualViewport.height + "\nfont-size: " +
			window.getComputedStyle(aboba, null).getPropertyValue("font-size");
	}, 100);
};
