const buttplug = require('buttplug/package.json');
const vuecomponent = require('vue-buttplug-material-component/package.json');
const fs = require('fs');

const revision = require('child_process')
      .execSync('git rev-parse --short HEAD')
      .toString().trim();

const config = {
  build_commit: revision,
  build_date: Date(),
  buttplug_version: buttplug.version,
  component_version: vuecomponent.version
};

const dir = process.env.PWD + "/dist/";

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.writeFileSync(dir + "appconfig.json", JSON.stringify(config));
