const util = require("util");
const {
  Actions,
  Builder,
  By,
  Key,
  until,
  Origin,
} = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const Path = require("path");
const Fs = require("fs");
const Express = require("express");
const Exec = util.promisify(require('child_process').exec);

const App = Express();
const Port = 3000;
const Config = JSON.parse(Fs.readFileSync("config.json"));

const FailureUrl = `http://localhost:${Port}/failure/`;
const SuccessUrl = `http://localhost:${Port}/success/`;

let lastUsefulBuildNumber = "";

App.use(Express.static("../client/build"));

App.get("/*", function (req, res) {
  res.sendFile(Path.join(__dirname, "../client/build", "index.html"));
});

App.listen(Port, async () => {
  log(`App listening at http://localhost:${Port}`);

  let options = new Options();
//   options.addArguments("--start-fullscreen");
  options.excludeSwitches("enable-automation");
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

//   await Actions(driver)
//     .move({ x: 0, y: 500, origin: Origin.VIEWPORT })
//     .build()
//     .perform();

  for (let i = 0; i <= Config.sites.length; i++) {
    if (i == Config.sites.length) {
      i = 0;
    }

    // await driver.get(`http://localhost:${port}/failure/fart`);
    await driver.get(Config.sites[i]);
    await pollForBuildUpdate(Config.siteDelayMs, 10000, driver);
    // await driver.sleep(Config.siteDelaySeconds, 10000, driver);
  }
});

async function pollForBuildUpdate(delay, interPollDelay, driver) {
  return new Promise(async (resolve, reject) => {
    let keepPolling = true;
    log("starting");

    let timeOut = setTimeout(() => {
      log("timeout");
      keepPolling = false;
    }, delay);

    while(keepPolling) {
      await snooze(interPollDelay);
      keepPolling = await poll(driver);
      log("returned " + keepPolling);
    }

    clearTimeout(timeOut);
    log("stopping");
    resolve();
  });
}

async function poll(driver) {
  const { stdout, stderr} = await Exec("az pipelines build list --definition-ids 39 --top 1");

  if (stderr) {
    log(stderr);
  }
  if (stdout) {
    let buildStatus = JSON.parse(stdout)[0];
    let result = buildStatus.result;
    let buildNumber = buildStatus.buildNumber;
    let displayName = buildStatus.requestedFor.displayName;

    log(displayName);
    log(result);
    log(buildNumber);

    if ((result == 'failed' || result == 'succeeded') && lastUsefulBuildNumber != buildNumber) {
      lastUsefulBuildNumber = buildNumber;
      let urlToVisit = FailureUrl + `${buildNumber} - ${displayName}`;

      if (result == 'succeeded') {
        urlToVisit = SuccessUrl + `${buildNumber} - ${displayName}`;
      }

      log(urlToVisit);
      await driver.get(urlToVisit);
      await driver.sleep(Config.statusDelayMs);
      log('stopping sleep');
      return false;
    }
  }
  return true;
}

const snooze = async ms => new Promise(resolve => setTimeout(resolve, ms));

function log(message) {
    console.log(new Date() + " // " + message);
}