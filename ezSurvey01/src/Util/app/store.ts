import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import commonReducer from '../../common/commonSlice';
import manageReducer from '../../manage/manageSlice';
import examReducer from '../../exam/examSlice'

export const store = configureStore({
  reducer: {
    common: commonReducer,
    manage: manageReducer,
    exam: examReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
