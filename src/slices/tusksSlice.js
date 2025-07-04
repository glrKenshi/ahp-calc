import { createSlice, createEntityAdapter, nanoid } from '@reduxjs/toolkit';

const tasksAdapter = createEntityAdapter();

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(),
  reducers: {
    addTask: {
      reducer: tasksAdapter.addOne,
      prepare: ({ name, criteria }) => ({
        payload: {
          id: nanoid(),
          name,
          criteria,
          items: [],
          criteriaComparisons: {},
          itemComparisons: {}
        }
      })
    },

    setItemsToTask: (state, action) => {
      const { taskId, items } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.items = items;
      }
    },

    setCriteriaComparison: (state, action) => {
      const { taskId, value } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.criteriaComparisons = value
      }
    },

    setItemComparison: (state, action) => {
      const { taskId, value } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.itemComparisons = value
      }
    },
    
    removeTask: tasksAdapter.removeOne,
  }
});

export const {
  addTask,
  setItemsToTask,
  setCriteriaComparison,
  setItemComparison,
  removeTask
} = tasksSlice.actions;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById
} = tasksAdapter.getSelectors(state => state.tasks);

export default tasksSlice.reducer;