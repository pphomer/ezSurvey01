﻿import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../Util/app/store';
import { client } from '../Util/api/client'

const initialState = {
  Exam: {},
  records: [],
  ExamList: [],
  status: 'idle',
  error: null,
}

export const fetchExam = createAsyncThunk(
  'exam/fetchExam',
  async (examParams: any) => {
    const { qnrid, examid } = examParams;
    const response = await client.get(`/api/Exam/${qnrid}/${examid||''}`);
    return response;
  })

export const updateExam = createAsyncThunk(
  'exam/updateExam',
  async (examParams: any, { rejectWithValue }) => {
    const { qnrid, exam } = examParams;
    console.log("updateExam exam", exam);
    
    try {
      const response = await client.post(`/api/Exam/${qnrid}`, exam);
      //console.log("updateExam response", response);
      return response
    } catch (err) {
      return rejectWithValue(err)
    }
  })

export const fetchExamList = createAsyncThunk(
  'manage/fetchExamList',
  async (qnrid: any = null, { rejectWithValue }) => {

    try {
      const response = await client.get(`/api/examlist/${qnrid}`);
      //console.log("fetchFillList response", response);
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  })


//function isPendingAction(action: AnyAction): action is PendingAction {
//  return action.type.endsWith('/pending')
//}

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    
    recordUpdated: {
      reducer: (state, action: PayloadAction<any>) => {
        const { questPId, fillList } = action.payload;

        const existsRecord = state.records.filter(r => r.questPId === questPId)[0];
        
        if (existsRecord) {
          state.records = state.records.map(r => r.questPId !== questPId
            ? r : { ...r, fillList } );
        }
        else {
          state.records = [...state.records, action.payload];
        }
      },
      prepare: (record) => {
        //const id = nanoid()
        console.log("recordUpdated prepare", record)
        return { payload: record}
      },
    },    
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchExam.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExamList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateExam.pending, (state) => {
        state.status = 'updateing';
      })      
      .addCase(updateExam.fulfilled, (state, action) => {
        state.status = 'updatedsucceeded';
        state.Exam = action.payload;
        console.log("updateExam.fulfilled", action.payload);
        state.records = action.payload.records;
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.status = 'updatedfail';
        console.log("updateExam.rejected", action.payload);
      })     
      .addCase(fetchExam.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("fetchExam.action.payload", action.payload);
        state.Exam = action.payload;
        state.records = action.payload.records||[];
      })
      .addCase(fetchExamList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("fetchExamList.action.payload", action.payload);
        //console.log("fetchSurvey.QuesList", action.payload.QuesList);
        state.ExamList = action.payload;
      })
      .addCase(fetchExamList.rejected, (state, action) => {
        state.status = "rejected";
        console.log("fetchExamList.action.payload", action.payload);
        //console.log("fetchSurvey.QuesList", action.payload.QuesList);
        state.ExamList = [];
      })
  },
});

export const { recordUpdated } = examSlice.actions

export default examSlice.reducer;

export const selectStatus = state => state.exam.status
export const selectQuesList = state => state.exam.QuesList;
export const selectExam = state => state.exam.Exam;
export const selectAllRecords = state => state.exam.records;
export const selectExamList = state => state.exam.ExamList;


//https://redux.js.org/usage/deriving-data-selectors

const selectQuestPId = (state, questPId) => questPId;

export const selectRecordsByQuestPId = createSelector(
  [selectAllRecords, (state, questPId: string) => questPId],
  (records, questPId) => records.filter(record => record.questPId === questPId)[0]
)