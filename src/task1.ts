async function retryFailures<T>(
  fn: () => Promise<T>,
  retries: number
): Promise<T> {
  let error;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      error = e;
    }
  }

  throw error;
}

function createTargetFunction(succeedsOnAttempt: number) {
  let attempt = 0;
  return async () => {
    if (++attempt === succeedsOnAttempt) {
      return attempt;
    }
    throw Object.assign(new Error(`failure`), { attempt });
  };
}

export default function task1() {
  retryFailures(createTargetFunction(3), 5).then((attempt) => {
    console.assert(attempt === 3);
  });

  // fails on attempt number 2 and throws last error
  retryFailures(createTargetFunction(3), 2).then(
    () => {
      throw new Error('should not succeed');
    },
    (e) => {
      console.assert(e.attempt === 2);
    }
  );

  // succeeds
  retryFailures(createTargetFunction(10), 10).then((attempt) => {
    console.assert(attempt === 10);
  });
}
