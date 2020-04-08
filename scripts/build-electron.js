const builder = require('electron-builder')

process.env.ELECTRON_BUILDER_CACHE = './.cache/electron-builder/'

const config = {
  appId: "fr.felicienbrochu.selflessheroes",
  productName: "Selfless Heroes",
  copyright: "Copyright © 2019 Félicien Brochu",
  directories: {
    output: 'electron-dist',
    buildResources: 'dist'
  },
  files: [
    "src/electron.js",
    "src/save/**/*",
    "dist/index.html",
    "dist/app.js",
    "dist/vendors~app.js",
    "dist/phaser.js",
    "dist/vendors~app~phaser.js",
    "dist/app.css",
    "dist/assets/**/*",
    "dist/workers/**/*",
  ],
  fileAssociations: [{
    ext: "shsv",
    name: "SHSV",
    description: "Selfless Heroes saved game",
    mimeType: "application/x-shsv",
    role: "Viewer",
  }],
  compression: "maximum",
  win: {
    target: ["portable", "nsis"],
    icon: "dist/icons/icon.ico"
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true
  },
  appx: {
    applicationId: "selflessheroes",
    displayName: "Selfless Heroes",
    identityName: "selflessheroes",
    languages: ["FR-FR", "EN-US"],
    backgroundColor: "#282C34",
  },
  mac: {
    target: ["dmg"],
    icon: "dist/icons/icon.icns",
    category: "public.app-category.puzzle-games",
  },
  linux: {
    target: ["snap", "deb"],
    synopsis: "Selfless Heroes is a puzzle game that will teach you how to program without you noticing",
    category: "LogicGame;Game",
    packageCategory: "LogicGame;Game",
  },
  snap: {
    summary: "Selfless Heroes is a puzzle game that will teach you how to program without you noticing",
    plugs: ["default", "audio-playback"],
  },
}

builder
  .build({
    config: config,
  })
  .then(message => {
    console.log(message)
  })
  .catch(exception => {
    console.error(exception)
  })