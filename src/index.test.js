import {render, fireEvent, act} from '@testing-library/react';
import React from 'react';
import {state, effect} from 'smx';
import {useLoadable, useValue} from 'react-smx';

const delay = (ms = 0, value) =>
  new Promise((resolve) => setTimeout(resolve, ms, value));

test('useValue(state)', () => {
  const countState = state(1);
  const increase = effect([countState, (value) => value + 1]);
  const App = () => {
    const count = useValue(countState);
    return (
      <>
        <h1 data-testid="count-value">{count}</h1>
        <button data-testid="increase-button" onClick={increase} />
      </>
    );
  };

  const {getByTestId} = render(<App />);
  const $countValue = getByTestId('count-value');
  const $increaseButton = getByTestId('increase-button');
  fireEvent.click($increaseButton);
  fireEvent.click($increaseButton);
  fireEvent.click($increaseButton);

  expect($countValue.innerHTML).toBe('4');
  expect(countState.value()).toBe(4);
});

test('useLoadable(state)', async () => {
  const countState = state(async () => {
    await delay(10);
    return 1;
  });
  const increase = effect(async () => [countState, (value) => value + 1]);
  const App = () => {
    const loadable = useLoadable(countState);
    return (
      <>
        <h1 data-testid="count-value">{loadable.state}</h1>
        <button data-testid="increase-button" onClick={increase} />
      </>
    );
  };

  const {getByTestId} = render(<App />);

  const $countValue = getByTestId('count-value');
  const $increaseButton = getByTestId('increase-button');

  expect($countValue.innerHTML).toBe('loading');

  fireEvent.click($increaseButton);
  fireEvent.click($increaseButton);
  fireEvent.click($increaseButton);

  await act(() => delay(15));

  expect($countValue.innerHTML).toBe('hasValue');
  await expect(countState.value()).resolves.toBe(4);
});
