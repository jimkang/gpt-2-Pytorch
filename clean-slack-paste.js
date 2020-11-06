/* global process */

var split = require("split");
var through2 = require("through2");

var stampRegex = /\d?\d:\d\d [A|P]M/;
var timeRegex = /^\d?\d:\d\d/;
var fileSizeRegex = /\(.* kB\)/;
var linkStartRegex = /^https?:\/\//;
var repliesRegex = /^\d+ repl(ies|y)$/;
var quoteRegex = /"/g;
var linkRegex = /https?:\/\/[^\s]+/g;
var imageRegex = /.+\.(jpg|png)$/;

const maxLines = 25;
var linesAdded = 0;

var filterStream = through2({ objectMode: true }, transformFn);

process.stdout.write(`
#!/bin/bash

../venv/bin/python main.py --top_k 80 --temperature 0.7 --nsamples 4 --text "`);

process.stdin.on("end", addTail);

process.stdin
  .pipe(split())
  .pipe(filterStream)
  .pipe(process.stdout);

function transformFn(line, enc, done) {
  if (
    linesAdded <= maxLines &&
    !stampRegex.test(line) &&
    !timeRegex.test(line) &&
    !linkStartRegex.test(line) &&
    !repliesRegex.test(line) &&
    !fileSizeRegex.test(line) &&
    !imageRegex.test(line) &&
    !line.startsWith("replied to a thread:")
  ) {
    const cleaned = line.replace(quoteRegex, "'").replace(linkRegex, "");
    this.push(cleaned + " \\\n\n");
    linesAdded += 1;
  }
  process.nextTick(done);
}

function addTail() {
  process.nextTick(() => process.stdout.write('"\n'));
}
