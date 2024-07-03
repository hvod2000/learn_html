const ping = 100;
const fixed_update_time = 100;
const player_speed = 0.05;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const KEYS = {
	"ArrowLeft": "left", "KeyJ": "left", "KeyA": "left",
	"ArrowRight": "right", "KeyL": "right", "KeyD": "right",
};
let time = -16;
player = { x: 0, y: 0, dx: 0, dy: 0 };
ghost = { x: 0, y: 0, dx: 0, dy: 0 };

(function (t) {
	requestAnimationFrame(arguments.callee);
	let dt = t - time;
	time = t;
	player.x += player.dx * dt * player_speed;
	ghost.x += ghost.dx * dt * player_speed;
	ctx.clearRect(0, 0, 320, 180);
	ctx.fillStyle = "blue";
	ctx.fillRect(ghost.x + 160 - 5, ghost.y + 90 - 5, 10, 10);
	ctx.fillStyle = "green";
	ctx.fillRect(player.x + 160 - 5, player.y + 90 - 5, 10, 10);
})(0);



addEventListener("keydown", (event) => {
	let key = event.code;
	if (KEYS[key] == "left") {
		player.dx = -1;
		delay(() => { ghost.dx = -1 });
	}
	if (KEYS[key] == "right") {
		player.dx = +1;
		delay(() => { ghost.dx = +1 });
	}
});
addEventListener("keyup", (event) => {
	let key = event.code;
	if (KEYS[key] == "left") {
		player.dx = 0;
		delay(() => { ghost.dx = 0 });
	}
	if (KEYS[key] == "right") {
		player.dx = 0;
		delay(() => { ghost.dx = 0 });
	}
});


function delay(f) {
	setTimeout(f, ping + fixed_update_time);
}
