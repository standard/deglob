const path = require('path')
const test = require('tape')
const deglob = require('../')

const playground = path.join(__dirname, 'playground')
const opts = { cwd: playground, gitIgnoreFile: 'custom-gitignore' }

const globbies = [
  {
    name: '*.txt useGitIgnore: default, usePackageJson: default',
    globs: '*.txt',
    opts: Object.assign({}, opts),
    expectedFiles: ['blah.txt']
  },
  {
    name: '*.txt useGitIgnore: false, usePackageJson: default',
    globs: '*.txt',
    opts: Object.assign({}, opts, { useGitIgnore: false }),
    expectedFiles: [
      'ignored-by-git.txt',
      'blah.txt']
  },
  {
    name: '*.txt useGitIgnore: false, usePackageJson: false',
    globs: '*.txt',
    opts: Object.assign({}, opts, { useGitIgnore: false, usePackageJson: false }),
    expectedFiles: [
      'ignored-by-git.txt',
      'ignored-by-package-json.txt',
      'blah.txt']
  },
  {
    name: '*.txt and *.json useGitIgnore: default, usePackageJson: false',
    globs: ['*.txt', '*.json'],
    opts: Object.assign({}, opts, { usePackageJson: false }),
    expectedFiles: [
      'ignored-by-package-json.txt',
      'blah.txt',
      'package.json']
  },
  {
    name: '*.txt and *.json useGitIgnore: default, usePackageJson: default, configKey: custom-ignore-blah',
    globs: ['*.txt'],
    opts: Object.assign({}, opts, { configKey: 'custom-ignore-blah' }),
    expectedFiles: ['ignored-by-package-json.txt']
  }
]

globbies.forEach(function (obj) {
  test('Testing ' + obj.name, function (t) {
    deglob(obj.globs, obj.opts, checkEm)

    function checkEm (err, files) {
      if (err) throw err
      const testName = obj.name + ' -- matches ' + obj.expectedFiles.length + ' files'
      t.equals(files.length, obj.expectedFiles.length, testName)
      obj.expectedFiles.forEach(function (expectedFile) {
        t.ok(files.indexOf(path.join(playground, expectedFile)) > -1, 'File in Result: ' + expectedFile)
      })
      t.end()
    }
  })
})
