"use strict";

// Print all entries, across all of the sources, in chronological order.

const { PriorityQueue } = require('@datastructures-js/priority-queue');

module.exports = (logSources, printer) => {

  // Create a priority queue instance to keep a subset of the logs in memory, ranked by the date property of each log
  const queue = new PriorityQueue(({ log: a }, { log: b}) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);
  
  // Push the first log and the index of the each the log source into the queue.
  logSources.forEach((source, index) => {
    queue.push({ log: source.pop(), logSourceIndex: index });
  });

  // The highest priority log is popped from the queue and  printed. A new log is popped from the log source of the just printed log and pushed into the queue. This is repeated till the queue is empty.
  while (!queue.isEmpty()) {
    const { log, logSourceIndex } = queue.pop();
    if (log) {
      printer.print(log);
      queue.push({ log: logSources[logSourceIndex].pop(), logSourceIndex });
    }
  }

  printer.done();
  return console.log("Sync sort complete.");
};
