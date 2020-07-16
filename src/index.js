import {useRef, useState, useEffect} from 'react';

const effectHook = useEffect;

export function useLoadable(targets) {
  const isMultiple = Array.isArray(targets);
  if (!isMultiple) {
    targets = [targets];
  }
  const contextRef = useDataRef(targets);
  const results = targets.map((target) => target.loadable());

  effectHook(() => {
    const context = contextRef.current;
    const removeListeners = targets.map((target) => {
      const removeStateListener = target.on(() => {
        removeStateListener.removeLoadableListener();

        removeStateListener.removeLoadableListener = target
          .loadable()
          .on(context.handleChange);

        context.handleChange();
      });
      removeStateListener.removeLoadableListener = target
        .loadable()
        .on(context.handleChange);

      return removeStateListener;
    });
    return () => {
      removeListeners.forEach((removeStateChangeListener) => {
        removeStateChangeListener.removeLoadableListener();
        removeStateChangeListener();
      });
    };
  }, targets);

  return isMultiple ? results : results[0];
}

export function useValue(targets) {
  const isMultiple = Array.isArray(targets);
  if (!isMultiple) {
    targets = [targets];
  }

  const contextRef = useDataRef(targets);

  const results = targets.map((target) => {
    const loadable = target.loadable();

    // is promise
    if (loadable.state === 'loading') {
      throw target.value();
    }

    if (loadable.state === 'hasError') {
      throw loadable.error;
    }

    return loadable.value;
  });

  effectHook(() => {
    const context = contextRef.current;
    const removeListeners = context.targets.map((target) =>
      target.on(context.handleChange),
    );
    return () => {
      removeListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, targets);

  return isMultiple ? results : results[0];
}

function useDataRef(targets) {
  const dataRef = useRef({});
  const [, rerender] = useState({});
  Object.assign(dataRef.current, {
    targets,
    rerender,
    handleChange() {
      if (dataRef.current.isUnmount) {
        return;
      }
      dataRef.current.rerender({});
    },
  });

  effectHook(
    () => () => {
      dataRef.current.isUnmount = true;
    },
    [],
  );

  return dataRef;
}
