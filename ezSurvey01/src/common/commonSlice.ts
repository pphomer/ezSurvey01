import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../Util/app/store';
import { client } from '../Util/api/client'

export interface iUser {
  
}



const initialState = {
  User: {},
  clientSettings: {},
  manageSettings: {},
  status: 'idle',
  error: null,
}


export const fetchUser = createAsyncThunk(
  'common/fetchUser',
  async () => {
    console.log("fetchUser1");
    const response = await client.get(`/api/User`);
    console.log("fetchUser2", response);
    return response;
  })

export const fetchClientSettings = createAsyncThunk(
  'common/fetchClientSettings',
  async () => {
    console.log("fetchClientSettings");
    const response = await client.get(`/api/clientSettings`);
    console.log("fetchClientSettings 2", response);
    return response;
  })

export const fetchManageSettings = createAsyncThunk(
  'common/fetchManageSettings',
  async () => {
    console.log("fetchManageSettings");
    const response = await client.get(`/api/manageSettings`);
    console.log("fetchManageSettings", response);
    return response;
  })


export const commonSlice = createSlice({
  name: 'common',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {    
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder      
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.User = action.payload;
        console.log("fetchUser.action.payload", action.payload);
      })
      .addCase(fetchClientSettings.fulfilled, (state, action) => {
        state.clientSettings = action.payload;
        console.log("fetchClientSettings.action.payload", action.payload);
      })
      .addCase(fetchManageSettings.fulfilled, (state, action) => {
        state.manageSettings = action.payload;
        console.log("fetchManageSettings.action.payload", action.payload);
      })
      //.addCase(fetchExam.fulfilled, (state, action) => {
      //  state.status = 'succeeded';
      //  console.log("fetchSurvey.action.payload", action.payload);
      //  console.log("fetchSurvey.QuesList", action.payload.QuesList);
      //  state.Exam = action.payload.Exam;
      //  state.Page = action.payload.Page;
      //  state.QuesList = action.payload.QuesList;
      //  state.Records = action.payload.Records;
      //})
      //.addCase(uploadUserFiles.fulfilled, (state, action) => {
      //  state.status = 'succeeded';
      //  state.Userfiles = action.payload
      //})
  },
});

export const { } = commonSlice.actions

export default commonSlice.reducer;

export const selectStatus = state => state.common.status
export const selectUser = state => state.common.User;
export const selectClientSettings = state => state.common.clientSettings;
export const selectManageSettings= state => state.common.manageSettings;

