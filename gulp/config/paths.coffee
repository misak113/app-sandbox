
basePath = __dirname + '/../..'
npmConfig = require basePath + '/package.json'
dist = basePath + '/dist'

paths = {
  basePath: basePath
  dist: dist
  front:
    mainFile: basePath + '/front.js'
  back:
    mainFile: basePath + '/' + npmConfig.main
  ts:
    config: basePath + '/tsconfig.json'
    src: [
      basePath + '/src/**/*.ts'
      basePath + '/src/**/*.tsx'
    ]
    specs: [
      basePath + '/specs/**/*.ts'
      basePath + '/specs/**/*.tsx'
    ]
    lint:
      config: basePath + '/tslint.json'
  tsd:
    config: basePath + '/tsd.json'
    src: basePath + '/typings/tsd.d.ts'
  less:
    src: basePath + '/src/index.less'
  reports:
    coveragePath: dist + '/reports/coverage'
}
module.exports = paths
