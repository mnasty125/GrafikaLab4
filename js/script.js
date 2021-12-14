"use-strict";
// Ширина и высота экрана
const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

// Инициализация канваса
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// Растягиваем на весь экран
canvas.width = vw;
canvas.height = vh;

// ГРАФИЧЕСКАЯ БИБЛИОТЕКА
//Функция отрисовки пикселя
let pixel = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 2, 1);
};
//Функция отрисовки линии по Алгоритму Брезенхема
let DrawLine = (x1, y1, x2, y2, stroke) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  if (
    (Math.abs(dx) > Math.abs(dy) && x2 < x1) ||
    (Math.abs(dx) <= Math.abs(dy) && y2 < y1)
  ) {
    let x = x1;
    x1 = x2;
    x2 = x;
    let y = y1;
    y1 = y2;
    y2 = y;
  }
  dx = x2 - x1;
  dy = y2 - y1;

  let stp = 1;
  pixel(x1, x2, stroke);

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dy < 0) {
      stp = -1;
      dy *= -1;
    }
    let d = dy * 2 - dx;
    let d1 = dy * 2;
    let d2 = (dy - dx) * 2;
    y = y1;
    for (x = x1 + 1; x <= x2; x++) {
      if (d > 0) {
        y = y + stp;
        d = d + d2;
      } else {
        d = d + d1;
      }
      pixel(x, y, stroke);
    }
  } else {
    if (dx < 0) {
      stp = -1;
      dx *= -1;
    }
    d = dx * 2 - dy;
    d1 = dx * 2;
    d2 = (dx - dy) * 2;
    x = x1;
    for (y = y1 + 1; y <= y2; y++) {
      if (d > 0) {
        x = x + stp;
        d = d + d2;
      } else {
        d = d + d1;
      }
      pixel(x, y, stroke);
    }
  }
};
//Функция рисования треугольника
let DrawTriangle = (x1, y1, x2, y2, x3, y3, stroke) => {
  DrawLine(x1, y1, x2, y2, stroke);
  DrawLine(x2, y2, x3, y3, stroke);
  DrawLine(x3, y3, x1, y1, stroke);
};
//Функция рисования окружности по Алгоритму Брезенхема
let DrawCircle = (_x, _y, radius, stroke) => {
  let x = 0,
    y = radius,
    gap = 0,
    delta = 2 - 2 * radius;
  while (y >= 0) {
    pixel(_x + x, _y + y, stroke);
    pixel(_x + x, _y - y, stroke);
    pixel(_x - x, _y - y, stroke);
    pixel(_x - x, _y + y, stroke);
    gap = 2 * (delta + y) - 1;
    if (delta < 0 && gap <= 0) {
      x++;
      delta += 2 * x + 1;
      continue;
    }
    if (delta > 0 && gap > 0) {
      y--;
      delta -= 2 * y + 1;
      continue;
    }
    x++;
    delta += 2 * (x - y);
    y--;
  }
};

//ТРИАНГУЛЯЦИЯ
//Площадь треугольника
// let triangleSquare = (A, B, C) => {
//   return (
//     (1 / 2) * Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y))
//   );
// };
// Принадлежит ли точка треугольнику?
let inTriangle = (A, B, C, D) => {
  return (
    triangleSquare(A, B, C) ===
    triangleSquare(A, B, D) + triangleSquare(A, C, D) + triangleSquare(B, D, C)
  );
};
// Левая тройка векторов?
let isLeft = (A, B, C) => {
  const AB = {
      x: B.x - A.x,
      y: B.y - A.y,
    },
    AC = {
      x: C.x - A.x,
      y: C.y - A.y,
    };

  return AB.x * AC.y - AC.x * AB.y < 0;
};
// Есть ли другие точки внутри рассматриваемого треугольника?
let hasPointOfPolygon = (points) => {
  const A = points[0],
    B = points[1],
    C = points[2];

  for (let p = 3; p < points.length; p++) {
    if (inTriangle(A, B, C, points[p])) return true;
  }

  return false;
};

let triangulate = (polygon) => {
  while (polygon.length >= 3) {
    if (
      isLeft(polygon[0], polygon[1], polygon[2]) &&
      !hasPointOfPolygon(polygon)
    ) {
      const x1 = polygon[0].x,
        y1 = polygon[0].y;
      const x2 = polygon[1].x,
        y2 = polygon[1].y;
      const x3 = polygon[2].x,
        y3 = polygon[2].y;
      DrawTriangle(x1, y1, x2, y2, x3, y3, color);

      polygon.splice(1, 1);
    } else {
      const tmp = polygon[0];
      polygon.shift();
      polygon.push(tmp);
    }
  }
};

//СОЗДАНИЕ МНОГОУГОЛЬНИКА
let points = [];

window.addEventListener("click", (event) => {
  points.push({ x: event.clientX, y: event.clientY });
  drawPoints();
});

let drawPoints = () => {
  ctx.clearRect(0, 0, vw, vh);
  points.forEach((p) => {
    DrawCircle(p.x, p.y, 2, "black");
  });
  //   for (let i = 0; i < points.length; i++) {
  //     DrawLine(
  //       points[i].x,
  //       points[i].y,
  //       points[i + 1].x,
  //       points[i + 1].y,
  //       "black"
  //     );
  //   }
  triangulate(points);
};

// window.addEventListener("keydown", () => {
//   DrawLine(
//     points[0].x,
//     points[0].y,
//     points[points.length - 1].x,
//     points[points.length - 1].y,
//     "black"
//   );

// });
