const HOLE_HEIGHT = 180;
const PIPE_WIDTH = 120;
const PIPE_INTERVAL = 1500;
let pipes = [];
const PIPE_SPEED = 0.75;
let timeSinceLastPipe;
let passPipeCount;

export function setupPipes() {
  document.documentElement.style.setProperty("--pipe-width", PIPE_WIDTH);
  document.documentElement.style.setProperty("--hole-height", HOLE_HEIGHT);
  pipes.forEach((pipe) => pipe.remove());
  timeSinceLastPipe = PIPE_INTERVAL;
  passPipeCount = 0;
}

export function updatePipes(delta) {
  timeSinceLastPipe += delta;

  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -= PIPE_INTERVAL;
    createPipe();
  }

  pipes.forEach((pipe) => {
    if (pipe.left + PIPE_WIDTH < 0) {
      passPipeCount++;
      return pipe.remove();
    }
    pipe.left = pipe.left - delta * PIPE_SPEED;
  });
}

export function getPassedPipeCount() {
  return passPipeCount;
}

export function getPipeRects() {
  return pipes.flatMap((pipe) => pipe.rects());
}

function createPipe() {
  const pipeElement = document.createElement("div");
  const topElem = createPipeSegment("top");
  const bottomElem = createPipeSegment("bottom");
  pipeElement.append(topElem);
  pipeElement.append(bottomElem);
  pipeElement.classList.add("pipe");
  pipeElement.style.setProperty(
    "--hole-top",
    randomNumberBetween(
      HOLE_HEIGHT * 1.5,
      window.innerHeight - HOLE_HEIGHT * 0.5
    )
  );
  const pipe = {
    get left() {
      return parseFloat(
        getComputedStyle(pipeElement).getPropertyValue("--pipe-left")
      );
    },
    set left(value) {
      pipeElement.style.setProperty("--pipe-left", value);
    },
    remove() {
      pipes = pipes.filter((p) => p !== pipe);
      pipeElement.remove();
    },
    rects() {
      return [
        topElem.getBoundingClientRect(),
        bottomElem.getBoundingClientRect()
      ];
    }
  };
  pipe.left = window.innerWidth;
  document.body.append(pipeElement);
  pipes.push(pipe);
}

function createPipeSegment(position) {
  const segement = document.createElement("div");
  segement.classList.add("segment", position);
  return segement;
}

function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
