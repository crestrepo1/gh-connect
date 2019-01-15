// concat all plugins (for the current environment) and export them as a single array
import fs from 'fs';
import path from 'path';

const pluginsArr = [];
const files = fs.readdirSync(__dirname).filter((f) => {
    const env = process.env.NODE_ENV;
    const devPlugin = f.indexOf('.dev') > -1;

    // if we are not in the dev env and the plugin is only for dev, return false
    if (env !== 'development' && devPlugin) {
        return false;
    }

    return f !== 'index.js' && path.extname(f) === '.js';
});

for (let i = 0; i < files.length; i++) {
    // eslint-disable-next-line
    let plugin = require(`./${files[i]}`).default;
    pluginsArr.push(plugin);
}

export default pluginsArr;
