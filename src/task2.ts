function getFnParamNames(fn: (..._: any[]) => any) {
  const fnStr = fn.toString();
  const arrowMatch = fnStr.match(/\(?[^]*?\)?\s*=>/);
  if (arrowMatch)
    return arrowMatch[0]
      .replace(/[()\s]/gi, '')
      .replace('=>', '')
      .split(',');
  const match = fnStr.match(/\([^]*?\)/);
  return match ? match[0].replace(/[()\s]/gi, '').split(',') : [];
}

function defaultArguments(
  func: (..._: any[]) => any,
  defaultArgs: Record<string, any>
) {
  return (...args: any[]) => {
    const argsParamNames = getFnParamNames(func);
    const argsValues = argsParamNames.map(
      (argsParamName, idx) => args[idx] ?? defaultArgs[argsParamName]
    );
    return func.apply(null, argsValues);
  };
}

function add(a: number, b: number) {
  return a + b;
}

export default function task2() {
  const add2 = defaultArguments(add, { b: 9 });
  console.assert(add2(10) === 19);
  console.assert(add2(10, 7) === 17);
  console.assert(isNaN(add2()));

  const add3 = defaultArguments(add, { b: 3, a: 2 });
  console.assert(add3(10) === 13);
  console.assert(add3() === 5);

  const add4 = defaultArguments(add, { c: 3 });
  console.assert(add4(10, 10) === 20);
}
