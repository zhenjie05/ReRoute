// Load frontend TypeScript fixtures in Node without starting React Native.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  const filename = path.resolve(root, file);
  if (cache.has(filename)) return cache.get(filename).exports;
  if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
  const unit = new Module(filename, module);
  cache.set(filename, unit);
  unit.paths = module.paths;
  unit.require = id => {
    if (id === 'expo-asset') return { Asset: { fromModule: uri => ({ uri }) } };
    if (id.startsWith('.') || id.startsWith('@/')) {
      const target = id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : path.resolve(path.dirname(filename), id);
      if (/\.(png|jpg|glb)$/i.test(target)) return target;
      const candidate = [target, target + '.ts', target + '.tsx', target + '.json'].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
      if (!candidate) throw new Error('Cannot resolve ' + target);
      return load(candidate);
    }
    return require(id);
  };
  unit._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText, filename);
  return unit.exports;
}
module.exports = { load };
