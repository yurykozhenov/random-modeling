const async = require('asyncawait/async');
const await = require('asyncawait/await');
const math = require('mathjs');
const _ = require('lodash');

const question = require('./question');

const utils = require('./shared/utils');
const linearCongruential = require('./shared/linear-congruential');

const min = 10;
const max = 25;

const m = utils.randomPrime(min, max);
const generator = linearCongruential(min, max, m);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static random() {
    const x = math.randomInt(min, max);
    const y = math.randomInt(min, max);

    return new Point(x, y);
  }

  static pseudoRandom(a, b, c, d) {
    const r = generator.next().value / m;
    const g = generator.next().value / m;

    const x = (b - a) * r + a;
    const y = (d - c) * g + c;

    return new Point(x, y);
  }
}

class Shape {
  constructor(points) {
    this.points = points;
  }

  static random() {
    const p0 = Point.random();
    const p1 = Point.random();
    const p2 = Point.random();
    const p3 = Point.random();

    const points = [p0, p1, p2, p3];

    return new Shape(points);
  }

  contains(point) {
    let isInside = false;

    for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
      const xi = this.points[i].x, yi = this.points[i].y;
      const xj = this.points[j].x, yj = this.points[j].y;

      const intersect = ((yi > point.y) != (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) {
        isInside = !isInside;
      }
    }

    return isInside;
  }
}

class Rectangle extends Shape {
  constructor(a, b, c, d) {
    const p0 = { x: a, y: c };
    const p1 = { x: b, y: c };
    const p2 = { x: a, y: d };
    const p3 = { x: b, y: d };
    const points = [p0, p1, p2, p3];

    super(points);

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  getArea() {
    return (this.b - this.a) * (this.d - this.c);
  }
}

const main = async(function() {
  const shape = Shape.random();

  console.log('Фігура: ');

  for (let i = 0; i < shape.points.length; i++) {
    console.log(`${i}: (${shape.points[i].x}, ${shape.points[i].y})`);
  }

  const experimentsCount = Number(await(question('Введіть кількість експериментів: ')));
  const pointsCount = Number(await(question('Введіть кількість генеруємих точок: ')));

  const xCoords = shape.points.map(point => point.x);
  const yCoords = shape.points.map(point => point.y);

  const a = Math.min(...xCoords);
  const b = Math.max(...xCoords);
  const c = Math.min(...yCoords);
  const d = Math.max(...yCoords);

  const rect = new Rectangle(a, b, c, d);
  const rectArea = rect.getArea();

  const areas = _.times(experimentsCount, () => {
    const points = _.times(pointsCount, () => Point.pseudoRandom(a, b, c, d));
    const m = points.filter(point => shape.contains(point)).length;
    const n = points.filter(point => rect.contains(point)).length;

    return (m / n) * rectArea;
  })
    .filter(area => Number.isFinite(area));

  const avgArea = Math.trunc(areas.reduce((acc, area) => acc + area, 0) / experimentsCount);

  console.log(`Площа фігури: ${avgArea}`);

  process.exit(0);
});

main();
