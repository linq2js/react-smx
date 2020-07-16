import {useValue, useLoadable} from './index';
import {state} from 'smx';

const count = state(0);
const asyncCount = state(async () => {
  return 100;
});
const countValue = useValue(count);
const asyncCountValue = useValue(asyncCount);
const asyncCountValues = useValue([asyncCount, asyncCount]);
const asyncCountLoadable = useLoadable(asyncCount);
const asyncCountLoadables = useLoadable([asyncCount, asyncCount]);

console.log(
  countValue,
  asyncCountValue,
  asyncCountValues,
  asyncCountLoadable,
  asyncCountLoadables,
);
