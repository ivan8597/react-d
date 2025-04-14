import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, Dictionary } from '../../types';
import data from '../../data.json';
import dictionary from '../../dictionay.json';

interface TasksState {
  tasks: Task[];
  dictionary: Dictionary;
}

const initialState: TasksState = {
  tasks: data.map((task, index) => ({
    ...task,
    id: `task-${index}`, 
    description: '',
    createdAt: new Date().toISOString(),
    taskAssigneeName: task.assigneeId 
      ? dictionary.assignees[String(task.assigneeId) as keyof typeof dictionary.assignees] 
      : undefined,
  })),
  dictionary,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; statusId: number }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.statusId = action.payload.statusId;
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, updateTaskStatus } =
  tasksSlice.actions;
export default tasksSlice.reducer;