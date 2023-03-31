function modulo(x, y) {
	return (x % y + y) % y;
}

function merge(u, v, alpha) {
	const result = [];
	const length = Math.min(u.length, v.length);
	for (let i = 0; i < length; i++) {
		result.push(Math.round(u[i] + (v[i] - u[i]) * alpha));
	}
	return result;
}

function randomGridColor() {
	const color = merge([43, 43, 54], [23, 24, 34], Math.random());
	return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}

function randomInteger(start, end) {
	return Math.trunc(Math.random() * (end - start) + start);
}

window.onload = function () {
	const CANVAS_SIZE = 360;
	const GRID_SIZE = 15;
	const ARROW_KEYS = {
		"ArrowUp": { y: -1 },
		"ArrowLeft": { x: -1 },
		"ArrowDown": { y: 1 },
		"ArrowRight": { x: 1 },
		"KeyW": { y: -1 },
		"KeyA": { x: -1 },
		"KeyS": { y: +1 },
		"KeyD": { x: +1 },
		"KeyI": { y: -1 },
		"KeyJ": { x: -1 },
		"KeyK": { y: +1 },
		"KeyL": { x: +1 },
	};
	const DEFAULT_SNAKE_SIZE = 4;

	const cvs = document.getElementById("snake");
	cvs.width = cvs.height = CANVAS_SIZE;
	const ctx = cvs.getContext("2d");
	const cs = CANVAS_SIZE / GRID_SIZE | 0;
	const snake = {
		x: GRID_SIZE / 2 | 0,
		y: GRID_SIZE / 2 | 0,
		direction: { x: 0, y: -1 },
	};
	const apple = { x: GRID_SIZE * 3 / 4 | 0, y: GRID_SIZE * 3 / 4 | 0 };
	let tail = [];
	for (let i = 0; i < DEFAULT_SNAKE_SIZE; i++) {
		tail.push({ x: snake.x, y: snake.y });
	}
	let eaten_tail = [];
	const grid_colors = [];
	for (let y = 0; y < GRID_SIZE; y++) {
		const grid_colors_row = [];
		for (let x = 0; x < GRID_SIZE; x++) {
			grid_colors_row.push(randomGridColor());
		}
		grid_colors.push(grid_colors_row);
	}
	document.addEventListener("keydown", (event) => {
		if (document.activeElement != cvs) return;
		if (event.ctrlKey || event.altKey || event.shiftKey) return;
		// TODO: use layout-dependent arrows
		if (event.code in ARROW_KEYS) {
			snake.direction = ARROW_KEYS[event.code];
			event.preventDefault();
		}
		if (event.key == "Escape") {
			document.activeElement.blur();
		}
	});
	cvs.addEventListener("focus", (_) => {
		console.log("aboba");
		cvs.scrollIntoView({ block: "center" });
	});
	function render() {
		ctx.fillStyle = "#151621";
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		for (let x = 0; x < GRID_SIZE; x++) {
			for (let y = 0; y < GRID_SIZE; y++) {
				ctx.fillStyle = grid_colors[y][x];
				ctx.fillRect(1 + x * cs, 1 + y * cs, cs - 2, cs - 2);
			}
		}
		if (document.activeElement == cvs) {
			for (let i = 0; i < 10; i++) {
				grid_colors[randomInteger(0, GRID_SIZE)][
					randomInteger(0, GRID_SIZE)
				] = randomGridColor();
			}
		}
		ctx.fillStyle = "#00880055";
		for (let i = 0; i < eaten_tail.length; i++) {
			ctx.fillRect(
				1 + eaten_tail[i].x * cs,
				1 + eaten_tail[i].y * cs,
				cs - 2,
				cs - 2,
			);
		}
		if (Math.random() < eaten_tail.length / GRID_SIZE / GRID_SIZE / 2) {
			eaten_tail.splice(randomInteger(0, eaten_tail.length), 1);
		}
		ctx.fillStyle = "#00ff00";
		for (let i = 0; i < tail.length; i++) {
			ctx.fillRect(
				1 + tail[i].x * cs,
				1 + tail[i].y * cs,
				cs - 2,
				cs - 2,
			);
		}
		ctx.fillStyle = "#ff0000";
		ctx.fillRect(1 + apple.x * cs, 1 + apple.y * cs, cs - 2, cs - 2);
		if (document.activeElement != cvs) {
			ctx.font = "32px Monospace";
			ctx.fillStyle = "#fff";
			ctx.textAlign = "center";
			ctx.fillText("click to play", cvs.width / 2, 32);
		}
	}
	function tick() {
		if (document.activeElement != cvs) return;
		if (!snake.direction.x && !snake.direction.y) return;
		snake.x += snake.direction.x ?? 0;
		snake.y += snake.direction.y ?? 0;
		if (snake.x >= GRID_SIZE) {
			snake.x = 0;
			snake.y -= 7;
		}
		if (snake.x < 0) {
			snake.x = GRID_SIZE - 1;
			snake.y += 7;
		}
		snake.y = modulo(snake.y, GRID_SIZE);

		if (apple.x == snake.x && apple.y == snake.y) {
			// TODO: while apple in snake
			apple.x = Math.floor(Math.random() * GRID_SIZE);
			apple.y = Math.floor(Math.random() * GRID_SIZE);
		} else {
			tail.shift();
		}
		for (let i = 0; i < tail.length; i++) {
			if (tail[i].x != snake.x || tail[i].y != snake.y) {
				continue;
			}
			eaten_tail = eaten_tail.concat(tail.slice(0, i));
			tail = tail.slice(i);
		}
		tail.push({ x: snake.x, y: snake.y });
	}
	setInterval(() => {
		tick();
		render();
	}, 1000 / 16);
};
