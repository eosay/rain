const readline = require("readline");

class GameObject {
  constructor(
    name = "",
    texture = "",
    points = [],
    position = [0, 0],
    updater = () => {}
  ) {
    this.name = name;
    this.texture = texture;
    this.points = points;
    this.position = position;
    this.updater = updater;
  }

  update(delta_time) {
    this.updater(delta_time);
  }
}

const keypress = (handlers) => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", (data, key) => {
    if (key.ctrl && key.name == "c") {
      // clear screen
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      process.exit();
    }
    if (handlers.hasOwnProperty(key.name)) {
      handlers[key.name]();
    }
  });
};

const terminal_renderer = (gameobjects) => {
  // clear screen
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  // render objects
  gameobjects.forEach((go) => {
    for (let i = 0; i < go.points.length; i++) {
      const world_point = [
        go.points[i][0] + go.position[0],
        go.points[i][1] + go.position[1],
      ];
      if (
        world_point[0] >= 0 &&
        world_point[0] <= size[0] &&
        world_point[1] >= 0 &&
        world_point[1] <= size[1]
      ) {
        readline.cursorTo(process.stdout, world_point[0], world_point[1]);
        process.stdout.write(go.texture[i]);
      }
    }
  });
};

const update = () => {
  setInterval(() => {
    gameobjects.forEach((go) => {
      go.update();
    });
    terminal_renderer(gameobjects);
  }, 1000 / rate);
};

const randint = (max) => {
  return Math.floor(Math.random() * max);
};

const rate = 60;
const ndrops = 20;
let gameobjects = [];
let size = [process.stdout.columns, process.stdout.rows];
process.stdout.write("\x1B[?25l"); // hide cursor

for (let i = 0; i < ndrops; i++) {
  let go = new GameObject(
    i.toString(),
    "[|}",
    [
      [0, -1],
      [0, 0],
      [0, 1],
    ],
    [randint(size[0]), randint(size[1])]
  );
  go.updater = () => {
    go.position[1] += 1;
    if (go.position[1] > size[1]) {
      go.position = [randint(size[0]), 0];
    }
  };
  gameobjects.push(go);
}

keypress({});
update();
