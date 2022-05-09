import _ from 'lodash';

export const stepTimeout = (fn, step = 1, timer = { min: 300, max: 1000 }) => {
  const timeout = _.random(timer.min, timer.max);
  setTimeout(() => {
    fn();
  }, timeout * step);
};
