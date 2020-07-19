# react-smx

React bindings for [smx](https://www.npmjs.com/package/smx)

## Intro

This section assumes you have installed smx, react-smx and React.
See the Getting Started page for how to get started with Recoil and React from scratch.
Components in the following sections are assumed to have a <RecoilRoot /> in the parent tree.

In this tutorial, we'll be building a simple todo-list application. Our app will be able to do the following:

Add todo items
Edit todo items
Delete todo items
Filter todo items
Display useful stats
Along the way, we'll cover states, effects, state families, and the hooks exposed by the react-smx. We'll also cover optimization

## States

States contain the source of truth for our application state.
In our todo-list, the source of truth will be an array of objects, with each object representing a todo item.

We'll call our list state todoListState and create it using the state() function:

```jsx harmony
import {state} from 'smx';

const todoListState = state([]);
```

To read the contents of this state, we can use the useValue() hook in our TodoList component:

```jsx harmony
import {useValue} from 'react-smx';
import todoListState from './states/todoListState';

function TodoList() {
  const todoList = useValue(todoListState);

  return (
    <>
      {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}
```

The commented-out components will be implemented in the sections that follow.

To create new todo items, we need to mutate value of todoListState.
We can use the effect hook to mutate a state:

```jsx harmony
import {useRef} from 'react';
import {effect} from 'smx';
import todoListState from './states/todoListState';

const addTodo = effect((payload) => {
  const {text, isCompleted} = payload;
  // get current value of todoListState
  const oldTodoList = todoListState.value();

  // just return a tuple [stateObject, newValue] to mutate specific state
  return [
    todoListState,
    [
      ...oldTodoList,
      {
        id: Math.random(),
        text,
        isCompleted,
      },
    ],
  ];
});

// shorter version of addTodo
const addTodo = effect(({text, isCompleted}) => [
  todoListState,
  // state reducer
  (oldTodoList) => [
    ...oldTodoList,
    {
      id: Math.random(),
      text,
      isCompleted,
    },
  ],
]);

// shortest version
const addTodo = effect([
  todoListState,
  // state reducer
  // second param is effect payload
  (oldTodoList, {text, isCompleted}) => [
    ...oldTodoList,
    {
      id: Math.random(),
      text,
      isCompleted,
    },
  ],
]);

function TodoItemCreator() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    addTodo({text: inputRef.current.value, isCompleted: false});
    inputRef.current.value = '';
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button onClick={addTodo}>Add</button>
    </form>
  );
}
```
