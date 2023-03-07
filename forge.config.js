const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');

module.exports = {
  buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',
  packagerConfig: {
    appBundleId: fromBuildIdentifier({beta: 'com.beta.app.tempus', prod: 'com.app.tempus'}),
    icon: 'icons/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      config: {
        name: "Tempus",
        options: {
          icon: 'icons/icon.png'
        }
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: "Tempus",
        options: {
          icon: 'icons/icon.png'
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: "Tempus",
      }
    }
  ],
};
