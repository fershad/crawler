import Crawler from "simplecrawler";
import { mkdirSync, writeFileSync, createWriteStream } from "fs";
import { join } from "path";
import chalk from "chalk";
import {exclude} from './excludeList.js'

const extRegex = new RegExp(`\\.(${exclude})$`, "i");

const siteUrl = process.argv[2];
const crawler = new Crawler(siteUrl);

// file type exclusion
crawler.addFetchCondition((parsedUrl) => !parsedUrl.path.match(extRegex));
crawler.respectRobotsTxt = true;

const dir = join(process.cwd(), "data", `${Date.now()}`);
mkdirSync(dir, {
  recursive: true,
});
const file = `${dir}/urls.csv`;
writeFileSync(file, "URL,content_type,bytes,response\n", {
  encoding: "utf-8",
});
console.log("Created CSV file");
const stream = createWriteStream(file, {
  flags: "a",
});

const makeUrlRow = (queueItem, responseBuffer, response) => {
  return `"${queueItem.url}",${response.headers["content-type"]},${responseBuffer.length},${response.statusCode}\n`;
};

// Set up the crawler

crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
  console.log(
    chalk.green(
      queueItem.url,
      response.headers["content-type"],
      responseBuffer.length
    )
  );
  stream.write(makeUrlRow(queueItem, responseBuffer, response));
});

crawler.on("complete", function () {
  console.log("Crawling complete");
});

crawler.on("fetcherror", logError);
crawler.on("fetch404", logError);
crawler.on("fetch410", logError);

function logError(queueItem, response) {
  console.log(
    chalk.red(`Error fetching (${response.statusCode}): ${queueItem.url}`)
  );
}

console.log("Starting the crawl...");
crawler.start();
