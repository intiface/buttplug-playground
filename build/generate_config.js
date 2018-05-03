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

fs.writeFileSync(process.env.PWD + "/dist/appconfig.json", JSON.stringify(config));
