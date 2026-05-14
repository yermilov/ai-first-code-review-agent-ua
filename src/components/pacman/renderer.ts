import { Sprite } from './types';
import type { GameState } from './types';
import { sprites } from './sprites';

const W = 320;
const H = 240;

interface Palette {
  background: string;
  wallOuter: string;
  wallMid: string;
  wallInner: string;
  pathDot: string;
  laneLine: string;
  dotIdle: string;
  dotEaten: string;
  progressBarBg: string;
  progressBarBorder: string;
  throughputLabel: string;
}

const DARK_PALETTE: Palette = {
  background: '#0a0e14',
  wallOuter: '#1a2332',
  wallMid: '#243044',
  wallInner: '#1a2332',
  pathDot: 'rgba(74, 85, 104, 0.5)',
  laneLine: 'rgba(74, 85, 104, 0.15)',
  dotIdle: '#4a5568',
  dotEaten: '#7ee787',
  progressBarBg: '#1a202c',
  progressBarBorder: '#4a5568',
  throughputLabel: 'rgba(226, 232, 240, 0.3)',
};

const LIGHT_PALETTE: Palette = {
  // Warm aged-paper background — the maze is now an ink sketch on parchment
  background: '#ecdfc8',
  // Walls become layered ink — outer is darkest, inner shows highlight
  wallOuter: '#5c3a1a',
  wallMid: '#8c5e2e',
  wallInner: '#3a2410',
  pathDot: 'rgba(120, 70, 20, 0.35)',
  laneLine: 'rgba(120, 70, 20, 0.25)',
  dotIdle: 'rgba(120, 70, 20, 0.55)',
  // Pellet eat-glow stays green so Pac-Man feedback is consistent across themes
  dotEaten: '#2f7a3a',
  progressBarBg: 'rgba(120, 70, 20, 0.18)',
  progressBarBorder: 'rgba(120, 70, 20, 0.45)',
  throughputLabel: 'rgba(58, 36, 16, 0.55)',
};

function getPalette(): Palette {
  if (typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'light') {
    return LIGHT_PALETTE;
  }
  return DARK_PALETTE;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  scale: number = 2,
  opacity: number = 1,
  flipH: boolean = false,
) {
  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = opacity;

  for (let row = 0; row < sprite.height; row++) {
    for (let col = 0; col < sprite.width; col++) {
      const colorIdx = sprite.pixels[row][col];
      if (colorIdx === 0) continue;
      ctx.fillStyle = sprite.palette[colorIdx];
      const drawCol = flipH ? sprite.width - 1 - col : col;
      ctx.fillRect(
        Math.floor(x + drawCol * scale),
        Math.floor(y + row * scale),
        scale,
        scale,
      );
    }
  }

  ctx.globalAlpha = prevAlpha;
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, eaten: boolean, opacity: number, palette: Palette) {
  if (eaten && opacity <= 0) return;
  ctx.globalAlpha = eaten ? opacity : 0.6;
  ctx.fillStyle = eaten ? palette.dotEaten : palette.dotIdle;
  const size = eaten ? 1 : 2;
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  ctx.globalAlpha = 1;
}

function drawProgressBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, progress: number, color: string, palette: Palette) {
  // Background
  ctx.fillStyle = palette.progressBarBg;
  ctx.fillRect(x, y, width, 4);
  // Fill
  ctx.fillStyle = color;
  ctx.fillRect(x, y, Math.floor(width * progress), 4);
  // Border
  ctx.strokeStyle = palette.progressBarBorder;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x, y, width, 4);
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, broken: boolean, breakProgress: number) {
  if (broken && breakProgress >= 1) return;
  const opacity = broken ? 1 - breakProgress : 1;
  if (broken) {
    // Crumbling effect - scatter pieces
    const pieces = 4;
    for (let i = 0; i < pieces; i++) {
      const offsetX = (Math.sin(i * 2.1 + breakProgress * 5) * breakProgress * 10);
      const offsetY = breakProgress * 15 * (i % 2 === 0 ? 1 : -1);
      drawSprite(ctx, sprites.wall, x + offsetX, y + offsetY, 1, opacity * (1 - breakProgress * 0.5));
    }
  } else {
    drawSprite(ctx, sprites.wall, x, y, 2, opacity);
  }
}

const TILE = 16;

function drawMaze(ctx: CanvasRenderingContext2D, maze: number[][], eatenDots: Set<string>, palette: Palette) {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 1) {
        // Wall tile with slight 8-bit bevel
        const x = col * TILE;
        const y = row * TILE;
        ctx.fillStyle = palette.wallOuter;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = palette.wallMid;
        ctx.fillRect(x + 1, y + 1, TILE - 2, TILE - 2);
        ctx.fillStyle = palette.wallInner;
        ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
      } else if (!eatenDots.has(`${col},${row}`)) {
        // Path dot (small pellet in center)
        const cx = col * TILE + TILE / 2;
        const cy = row * TILE + TILE / 2;
        ctx.fillStyle = palette.pathDot;
        ctx.fillRect(cx - 1, cy - 1, 3, 3);
      }
    }
  }
}

export function render(ctx: CanvasRenderingContext2D, state: GameState) {
  const palette = getPalette();

  // Clear
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, W, H);

  if (state.labyrinth && state.maze.length > 0) {
    // Draw 2D maze
    drawMaze(ctx, state.maze, state.eatenDots, palette);
  } else {
    // Draw lane lines (subtle)
    ctx.strokeStyle = palette.laneLine;
    ctx.lineWidth = 0.5;
    for (const lane of state.lanes) {
      ctx.beginPath();
      ctx.moveTo(30, lane.y + 8);
      ctx.lineTo(310, lane.y + 8);
      ctx.stroke();
    }

    // Draw dots
    for (const lane of state.lanes) {
      for (const dot of lane.dots) {
        drawDot(ctx, dot.x, dot.y, dot.eaten, dot.eatenOpacity, palette);
      }
    }

    // Draw walls
    for (const wall of state.walls) {
      drawWall(ctx, wall.x, wall.y, wall.broken, wall.breakProgress);
    }
  }

  // Draw entities
  for (const entity of state.entities) {
    if (entity.opacity <= 0) continue;

    const flipH = entity.direction === -1;
    let sprite: Sprite;

    if (entity.sprite === 'person') {
      sprite = entity.animFrame % 2 === 0 ? sprites.personOpen : sprites.personClosed;
    } else {
      sprite = entity.animFrame % 2 === 0 ? sprites.clawdFrame1 : sprites.clawdFrame2;
    }

    // Stuck jiggle effect
    let drawX = entity.x;
    let drawY = entity.y;
    if (entity.state === 'stuck') {
      drawX += Math.sin(state.tick * 0.3) * 1.5;
    }

    drawSprite(ctx, sprite, drawX, drawY, 2, entity.opacity, flipH);

    // Draw zzz for sleeping entities
    if (entity.state === 'sleeping') {
      const zzzOffset = Math.sin(state.tick * 0.05) * 2;
      drawSprite(ctx, sprites.zzz, entity.x + 14, entity.y - 10 + zzzOffset, 1, 0.5 + Math.sin(state.tick * 0.08) * 0.3);
    }
  }

  // Draw progress bars
  for (const bar of state.progressBars) {
    const laneY = state.lanes[bar.lane]?.y ?? 0;
    drawProgressBar(ctx, 30, laneY + 20, 280, bar.progress, bar.color, palette);
  }

  // Draw subtle "THROUGHPUT" label when progress bars are showing
  if (state.progressBars.length > 2) {
    ctx.fillStyle = palette.throughputLabel;
    ctx.font = '6px monospace';
    ctx.fillText('THROUGHPUT', 130, H - 8);
  }
}
