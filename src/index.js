import {useRef, useState, useEffect} from 'react';
import {state} from 'smx';

export function useLoadable(targets) {
  return useWatcher(state.loadableWatcher, targets);
}

function useWatcher(watcherFactory, targets) {
  const watcherRef = useRef(undefined);
  const [, rerender] = useState(undefined);
  const watcher = (watcherRef.current = watcherFactory(
    targets,
    watcherRef.current,
  ));

  useEffect(() => watcher.watch(() => rerender({})), [watcher, rerender]);
  useEffect(() => () => watcher.dispose(), [watcher]);

  return watcher.get();
}

export function useValue(targets) {
  return useWatcher(state.valueWatcher, targets);
}
