export default class SnakeGame {
	static DEFAULT_SNAKE_SIZE = 4;
	static CANVAS_SIZE = 360;
	static GRID_SIZE = 15;
	static UPS = 16;
	static ARROW_KEYS = {
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
	constructor(container) {
		this.paused = true;
		container.style["aspect-ratio"] = "1/1";
		const cvs = document.createElement("canvas");
		cvs.style.imageRendering = "pixelated";
		cvs.style.backgroundColor = "#324";
		cvs.width = cvs.height = SnakeGame.CANVAS_SIZE;
		cvs.tabIndex = 0;
		container.prepend(cvs);
		const ctx = cvs.getContext("2d");
		this.canvas = cvs;
		ctx.imageSmoothingEnabled = false;
		ctx.fillStyle = "#808";
		ctx.fillRect(0, 0, cvs.width, cvs.height);
		this.ctx = ctx;
		this.reset();
		cvs.addEventListener("focus", _ => this.paused = false);
		cvs.addEventListener("blur", _ => this.paused = true);
		cvs.addEventListener("keydown", event => this.keydown(event));
		cvs.addEventListener("fullscreenchange", _ => {
			if (document.fullscreenElement != this.canvas)
				this.canvas.blur();
			else
				this.canvas.focus();
		});
		let lastTick = 0;
		const loop = t => {
			window.requestAnimationFrame(loop);
			if (t > lastTick + 1000 / SnakeGame.UPS) {
				let ticks = Math.floor((t - lastTick) * SnakeGame.UPS / 1000);
				for (let i = 0; i < ticks; i++)
					this.tick();
				lastTick += ticks * 1000 / SnakeGame.UPS;
			}
			this.render();
		}
		loop(0);
	}
	reset() {
		const { GRID_SIZE, DEFAULT_SNAKE_SIZE } = this.constructor;
		this.snake = {
			x: (GRID_SIZE / 2 | 0) - 1,
			y: (GRID_SIZE / 2 | 0) + 2,
			direction: { x: 0, y: -1 },
		};
		this.apple = {
			x: (GRID_SIZE / 2 | 0) + 1,
			y: (GRID_SIZE / 2 | 0) + 2
		};
		this.tail = [];
		for (let i = 0; i < DEFAULT_SNAKE_SIZE; i++)
			this.tail.push({ x: this.snake.x, y: this.snake.y });
		this.eaten_tail = [];
		this.grid_colors = [];
		for (let y = 0; y < GRID_SIZE; y++) {
			const grid_colors_row = [];
			for (let x = 0; x < GRID_SIZE; x++) {
				grid_colors_row.push(randomGridColor());
			}
			this.grid_colors.push(grid_colors_row);
		}
	}
	keydown(event) {
		if (this.paused) return;
		if (event.ctrlKey || event.altKey || event.shiftKey) return;
		// TODO: use layout-dependent arrows
		const { ARROW_KEYS } = this.constructor;
		if (event.code in ARROW_KEYS) {
			this.snake.direction = ARROW_KEYS[event.code];
			event.preventDefault();
		}
		if (event.key == "Escape") {
			// TODO: stop from pause on second press
			this.canvas.blur();
			this.paused = true;
		}
	}
	render() {
		const { CANVAS_SIZE, GRID_SIZE } = this.constructor;
		const { ctx, grid_colors, tail, eaten_tail, apple } = this;
		const cs = CANVAS_SIZE / GRID_SIZE | 0;
		ctx.fillStyle = "#213";
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		for (let x = 0; x < GRID_SIZE; x++) {
			for (let y = 0; y < GRID_SIZE; y++) {
				ctx.fillStyle = grid_colors[y][x];
				ctx.fillRect(1 + x * cs, 1 + y * cs, cs - 2, cs - 2);
			}
		}
		ctx.fillStyle = "#0004";
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
		ctx.fillStyle = "#f3f";
		for (let i = 0; i < tail.length; i++) {
			ctx.fillRect(
				1 + tail[i].x * cs,
				1 + tail[i].y * cs,
				cs - 2,
				cs - 2,
			);
		}
		ctx.fillStyle = "#f08";
		ctx.fillRect(1 + apple.x * cs, 1 + apple.y * cs, cs - 2, cs - 2);
		if (this.paused) ctx.drawImage(pauseMsgImage, 85, 173, 190, 14);
	}
	tick() {
		if (this.paused) return;
		const { GRID_SIZE } = this.constructor;
		let { snake, apple, tail, eaten_tail, grid_colors } = this;
		for (let i = 0; i < 10 - this.paused * 10; i++) {
			grid_colors[randomInteger(0, GRID_SIZE)][randomInteger(0, GRID_SIZE)]
				= randomGridColor();
		}
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
		this.eaten_tail = eaten_tail;
		tail.push({ x: snake.x, y: snake.y });
		this.tail = tail;
	}
}

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
	// const color = merge([43, 43, 54], [23, 24, 34], Math.random());
	// const color = merge([51, 34, 68], [136, 34, 119], Math.random());
	const color = merge([51, 34, 68], [91, 34, 101], Math.random());
	return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
}

function randomInteger(start, end) {
	return Math.trunc(Math.random() * (end - start) + start);
}

let pauseMsgImage = new Image();
pauseMsgImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAHAQMAAABUXwMsAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAGUExURUdwTP///5+UokMAAAABdFJOUwBA5thmAAAAS0lEQVQI12NgQAblwWUMAQ4MHGBOaIiru3vgc9nj5eFzGMrDS1lCAkM5XUNCQxhcA11dQhJDOF0cQwMYXM3K2MMDw3mPlJvGoBgGAAQMEZJuBC84AAAAAElFTkSuQmCC";

window.addEventListener("load", _ => {
	console.log("game");
	for (const canvasContainer of document.getElementsByClassName("snake-game"))
		new SnakeGame(canvasContainer);
});
