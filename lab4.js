function systemWithoutLimit(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, queueSize, threads = 1) {
  const avgProcessedRequestsPerHour = avgProcessedRequestsByThreadPerHour * threads;
  const systemLoad = avgRequestsPerHour / avgProcessedRequestsPerHour;

  const noWaitProb = 1 - systemLoad;
  const avgRequestsInSystem = systemLoad / (1 - systemLoad);
  const avgTimeInQueue = systemLoad / (avgProcessedRequestsPerHour - avgRequestsPerHour);
  const avgTimeInSystem = 1 / (avgProcessedRequestsPerHour - avgRequestsPerHour);
  const placeInQueueProb = 1 - Math.pow(systemLoad, queueSize) * (1 - systemLoad);

  const allThreadsLoadProb = Math.pow(systemLoad, threads * (1 - systemLoad));

  const avgFreeThreads = Math.max(threads - avgRequestsInSystem, 0);

  return {
    noWaitProb,
    avgRequestsInSystem,
    avgTimeInQueue,
    avgTimeInSystem,
    placeInQueueProb,

    allThreadsLoadProb,
    avgFreeThreads,
  };
}

function systemWithLimit(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, queueSize, threads = 1) {
  const avgProcessedRequestsPerHour = avgProcessedRequestsByThreadPerHour * threads;
  const systemLoad = avgRequestsPerHour / avgProcessedRequestsPerHour;
  const systemRequestsLimit = queueSize + 1;
  const systemLoadPow = Math.pow(systemLoad, (systemRequestsLimit + 1));

  const lossProb = nClientsProbability(systemLoad, systemRequestsLimit, systemRequestsLimit);
  const effectiveIntensity = avgRequestsPerHour * (1 - lossProb);

  const avgRequestsInSystem = (
    (systemLoad
      * (1 - (systemRequestsLimit + 1)
        * Math.pow(systemLoad, systemRequestsLimit)
        + systemRequestsLimit * systemLoadPow
      )
    )
    / ((1 - systemLoad) * (1 - systemLoadPow))
  );

  const avgTimeInSystem = avgRequestsInSystem / effectiveIntensity;
  const avgTimeInQueue = avgTimeInSystem - 1 / avgProcessedRequestsPerHour;

  const avgRequestsInQueue = Math.pow(systemLoad, 2) / (1 - systemLoad);
  const noWaitProb = 1 - systemLoad;

  return {
    lossProb,
    effectiveIntensity,
    avgRequestsInSystem,
    avgTimeInSystem,
    avgTimeInQueue,
    avgRequestsInQueue,
    noWaitProb,
  };
}

function nClientsProbability(systemLoad, n, limit) {
  if (systemLoad === 1) {
    return 1 / (limit + 1);
  }

  return (1 - systemLoad) * Math.pow(systemLoad, n) / (1 - Math.pow(systemLoad, (limit + 1)));
}

function getPreferableThreadsNumber(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, threads, prefWaitingTime) {
  let waitingTime = getWaitingTime(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour);
  let preferableThreads = threads;

  while (waitingTime > prefWaitingTime) {
    waitingTime = getWaitingTime(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, preferableThreads);
    preferableThreads += 1;
  }

  return preferableThreads;
}

function getWaitingTime(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, preferableThreads) {
  const avgProcessedRequestsPerHour = avgProcessedRequestsByThreadPerHour * preferableThreads;
  const systemLoad = avgRequestsPerHour / avgProcessedRequestsPerHour;

  return systemLoad / (avgProcessedRequestsPerHour - avgRequestsPerHour);
}

function task1() {
  const avgRequestsPerHour = 8;
  const avgProcessedRequestsPerHour = 9;
  const queueSize = 12;

  const {
    noWaitProb,
    avgRequestsInSystem,
    avgTimeInQueue,
    avgTimeInSystem,
    placeInQueueProb,
  } = systemWithoutLimit(avgRequestsPerHour, avgProcessedRequestsPerHour, queueSize);

  console.log('\nЗавдання 1:');
  console.log('Ймовірність того, що пацієнт, який прибув не буде чекати:', noWaitProb.toFixed(2));
  console.log('Середня кількість пацієнтів, що очікують на прийом:', avgRequestsInSystem.toFixed(0));
  console.log('Середній час очікування пацієнта від моменту прибуття до початку прийому:', (avgTimeInQueue * 60).toFixed(0), 'хв');
  console.log('Середній час, який витрачений пацієнтом на перебування в поліклініці:', (avgTimeInSystem * 60).toFixed(0), 'хв');
  console.log('Ймовірність того, що пацієнт, який прибуде на прийом до лікаря, матиме можливість очікувати на стільчику:', placeInQueueProb.toFixed(2));
}

function task2() {
  const avgRequestsPerHour = 4;
  const avgProcessedRequestsPerHour = 60 / 20;
  const queueSize = 3;

  const {
    effectiveIntensity,
    avgRequestsInSystem,
    avgTimeInQueue,
    avgTimeInSystem,
    lossProb,
  } = systemWithLimit(avgRequestsPerHour, avgProcessedRequestsPerHour, queueSize);

  console.log('\nЗавдання 2:');
  console.log('Ефективна інтенсивність надходження клієнтів до системи:', effectiveIntensity.toFixed(2));
  console.log('Середня кількість клієнтів, що очікують на обслуговування:', avgRequestsInSystem.toFixed(0));
  console.log('Середній час очікування клієнта від моменту прибуття до початку обслуговування:', (avgTimeInQueue * 60).toFixed(0), 'хв');
  console.log('Середній час, який витрачений на перебування клієнта в перукарні:', (avgTimeInSystem * 60).toFixed(0), 'хв');
  console.log('Ймовірність того, що клієнт, який зайде до перукарні та побачить, що всі місця зайняті, піде в пошуках іншої перукарні:', lossProb.toFixed(2));
}

function task3() {
  const avgRequestsPerHour = 16;
  const avgProcessedRequestsByThreadPerHour = 60 / 12;
  const threads = 4;
  const preferableWaitingTime = 5;

  const {
    allThreadsLoadProb,
    avgRequestsInSystem,
    avgTimeInQueue,
    avgFreeThreads,
  } = systemWithoutLimit(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, 0, threads);

  const preferableThreads = getPreferableThreadsNumber(avgRequestsPerHour, avgProcessedRequestsByThreadPerHour, threads, preferableWaitingTime);

  console.log('\nЗавдання 3:');
  console.log('Ймовірність того, що всі автомобілі служби на виклику:', allThreadsLoadProb.toFixed(2));
  console.log('Середня кількість вимог, що очікують на прибуття:', avgRequestsInSystem.toFixed(0));
  console.log('Середній час очікування клієнтом прибуття автомобіля (очікування в черзі):', (avgTimeInQueue * 60).toFixed(0), 'хв');
  console.log('Кількість автомобілів, яку слід мати компанії для того, щоб тривалість очікування клієнтом приїзду автомобіля становила не більше 5 хвилин:', preferableThreads);
  console.log('Середня кількість вільних автомобілів:', avgFreeThreads.toFixed(0));
}

function task4() {
  const avgRequestsPerHour = 6;
  const avgProcessedRequestsPerByThreadHour = 60 / 30;
  const queueSize = 5;
  const threads = 5;

  const {
    effectiveIntensity,
    noWaitProb,
    avgRequestsInSystem,
    avgRequestsInQueue,
  } = systemWithLimit(avgRequestsPerHour, avgProcessedRequestsPerByThreadHour, queueSize, threads);

  console.log('\nЗавдання 4:');
  console.log('Ефективна інтенсивність надходження клієнтів до системи:', effectiveIntensity.toFixed(2));
  console.log('Ймовірність того, що всі місця на стоянці будуть вільними:', noWaitProb.toFixed(2));
  console.log('Середня кількість автомобілів, які знаходяться в системі:', avgRequestsInSystem.toFixed(0));
  console.log('Середня кількість автомобілів, які очікують звільнення місця на стоянці:', avgRequestsInQueue.toFixed(0));
}

task1();
task2();
task3();
task4();
