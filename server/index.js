const util = require("util");
const path = require("path");
const {
  Builder,
  By
} = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const Path = require("path");
const Fs = require("fs");
const Express = require("express");
const Exec = util.promisify(require('child_process').exec);
const Sugar = require('sugar');

const App = Express();
const Port = 3000;
const Config = JSON.parse(Fs.readFileSync(path.resolve(__dirname, "config.json")));

const RegularSiteRefreshRateMs = Config.RegularSiteRefreshRateMs;
const BuildStatusPollRateMs = Config.BuildStatusPollRateMs;
const BuildStatusRefreshRateMs = Config.BuildStatusRefreshRateMs;

const FailureUrl = `http://localhost:${Port}/failure/`;
const SuccessUrl = `http://localhost:${Port}/success/`;

const BUILD_STATUS_DONT_DISPLAY = "dont care";
const BUILD_STATUS_FAILING = "failing";
const BUILD_STATUS_SUCCEEDING = "succeeding";

let buildStatus = BUILD_STATUS_DONT_DISPLAY;
let lastUsefulBuildNumber = "";

let regularSiteTimer;

App.use(Express.static("../client/build"));

App.get("/*", function (req, res) {
  res.sendFile(Path.join(__dirname, "../client/build", "index.html"));
});

App.listen(Port, async () => {
  log(`App listening at http://localhost:${Port}`);

  let options = new Options();
  options.addArguments("--start-fullscreen");
  options.excludeSwitches("enable-automation");
  options.addArguments("load-extension=/home/pi/.config/chromium/Default/Extensions/gighmmpiobklfepjocnamgkkbiglidom/4.40.0_0");

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  scheduleRegularSites(driver, 0);
  pollForBuildUpdate(driver);
});

async function scheduleRegularSites(driver, siteCounter) {
    clearTimeout(regularSiteTimer);

    let urlToVisit = Config.sites[siteCounter];
    log(`displaying regular site ${urlToVisit}`);

    await driver.get(urlToVisit);
    await performSiteSetup(urlToVisit, driver)

    regularSiteTimer = setTimeout(async () => {
      log("scheduling regular site loop");
      scheduleRegularSites(
          driver,
          siteCounter == Config.sites.length -1 ? 0 : siteCounter+1);
    }, RegularSiteRefreshRateMs);
}

async function pollForBuildUpdate(driver) {
  log("polling for build update");

  buildStatus = await getBuildStatus(driver);

  if (buildStatus != BUILD_STATUS_DONT_DISPLAY && buildStatus.urlToVisit) {
    while(!regularSiteTimer) {
        await snooze(500);
    }

    clearTimeout(regularSiteTimer);
    log(`displaying build status site ${buildStatus.urlToVisit}`);
    await driver.get(buildStatus.urlToVisit);

    regularSiteTimer = setTimeout(async () => {
      pollForBuildUpdate(driver);
      scheduleRegularSites(driver, 0);
    }, BuildStatusRefreshRateMs);
  } else {
    log("scheduling build status poll");
    regularSiteTimer = setTimeout(async () => {
      pollForBuildUpdate(driver);
    }, BuildStatusPollRateMs);
  }
}

async function getBuildStatus() {
  // add '--definitionids 39' if you are only interested in the On premise pipeline
  const { stdout, stderr} = await Exec("az pipelines build list --top 1");

  if (stderr) {
    log("querying build status produced error:");
    log(stderr);
  }
  if (stdout) {
    log("querying build status produced output:");
    log(stdout);
    let buildStatus = JSON.parse(stdout)[0];
    let result = buildStatus.result;
    let buildNumber = buildStatus.buildNumber;
    let displayName = buildStatus.requestedFor.displayName;
    let buildName = buildStatus.definition.name;
    let queueTime = new Sugar.Date(buildStatus.queueTime).format('%H:%M').raw;

    log(displayName);
    log(result);
    log(buildNumber);

    if ((result == 'failed' || result == 'succeeded') && lastUsefulBuildNumber != buildNumber) {
      lastUsefulBuildNumber = buildNumber;
      let urlToVisit = FailureUrl + `${buildName} - ${displayName} - ${queueTime}`;

      if (result == 'succeeded') {
        urlToVisit = SuccessUrl + `${buildName} - ${displayName} - ${queueTime}`;
      }

      return {
          status: result == 'failed' ? BUILD_STATUS_FAILING : BUILD_STATUS_SUCCEEDING,
          urlToVisit: urlToVisit
       };
    }
  }
  return {status: BUILD_STATUS_DONT_DISPLAY};
}

async function performSiteSetup(url, driver) {
  log(`performing additional setup for ${url}`);

  let handles = await driver.getAllWindowHandles();
  if (handles.length > 1) {
    await driver.switchTo().window(handles[1]);
    await driver.close();
    await driver.switchTo().window(handles[0]);
  }

  try {
    if (url.includes("https://weather.com/")) {
      await driver.sleep(5000);
      await driver.findElement(By.id("truste-consent-button")).click();
      return;
    }
    if (url.includes("https://www.bbc.co.uk/news/england/london")) {
      await driver.sleep(5000);
      await driver.findElement(By.id("bbccookies-continue-button")).click();
      return;
    }
  } catch(e) {
      log(`error visiting ${url}`);
      log(e);
  } finally {
      log(`finished additional setup for ${url}`);
  }
}

function log(message) {
    console.log(new Date() + " // " + message);
}

const snooze = async ms => new Promise(resolve => setTimeout(resolve, ms));
