"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const { PriorityQueue } = require('@datastructures-js/priority-queue');

module.exports = async (logSources, printer) => {
  const queue = new PriorityQueue(({ log: a }, { log: b}) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);

  await Promise.all(logSources.map(async (source, index) => {
    const log = await source.popAsync();
    if (log) {
      queue.push({ log, logSourceIndex: index });
    }
}))

  while (!queue.isEmpty()) {
    const { log, logSourceIndex } = queue.pop();
    if (log) {
      printer.print(log);
      queue.push({ log: await logSources[logSourceIndex].popAsync(), logSourceIndex });
    }
  }

  printer.done();
  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
};
