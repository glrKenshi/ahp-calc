import { createSlice, createEntityAdapter, nanoid } from '@reduxjs/toolkit';

const tasksAdapter = createEntityAdapter();

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(),

  reducers: {
    // Добавление новой задачи
    addTask: {
      reducer: tasksAdapter.addOne,
      prepare: ({ name, criteria }) => ({
        payload: {
          id: nanoid(),
          name,
          criteria,
          items: [],
          criteriaComparisons: [],
          itemComparisons: {}
        }
      })
    },

    // Присвоение массива items целиком
    setItemsToTask: (state, action) => {
      const { taskId, items } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.items = items;
      }
    },

    // Присвоение массива критериев сравнения целиком
    setCriteriaComparisons: (state, action) => {
      const { taskId, comparisons } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.criteriaComparisons = comparisons;
      }
    },

    // Присвоение объекта itemComparisons целиком
    setItemComparisons: (state, action) => {
      const { taskId, comparisons } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.itemComparisons = comparisons;
      }
    },

    // Пример удаления задачи
    removeTask: tasksAdapter.removeOne,
  }
});

const {actions, reducer} = tasksSlice


export default reducer;

export const {
  addTask,
  setItemsToTask,
  setCriteriaComparisons,
  setItemComparisons,
  removeTask
} = actions;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById
} = tasksAdapter.getSelectors(state => state.tasks);

