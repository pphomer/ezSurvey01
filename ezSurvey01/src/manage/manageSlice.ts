﻿import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { RootState } from '../Util/app/store';
import { client } from '../Util/api/client'

export interface iQNR {
  qnrid: number,
  title: string,
  startDate: string,
  endDate: string,
  period: string,
  questList : any
}

const manageAdapter = createEntityAdapter<iQNR>({
  selectId: (qnr: iQNR) => qnr.qnrid,
  sortComparer: (a, b) => b.qnrid - a.qnrid,
})



const initialState = manageAdapter.getInitialState({
  QNRObj: {} as any,
  questTypeList: [],
  status: 'idle',
  errors: {},
})


export const initCodeValues = createAsyncThunk(
  'quest/initCodeValues',
  async () => {
    console.log("initCodeValues");
    const response = await client.get('/api/CodeValues')
    console.log("initCodeValues", response);
    return response
  })

export const fetchQNRList = createAsyncThunk(
  'manage/fetchQNRList',
  async () => {
    const response = await client.get("/api/QNRList");
    return response;
  })

export const fetchQNR = createAsyncThunk(
  'manage/fetchQNR',
  async (id: number) => {
    console.log("fetchQNR");
    const response = await client.get(`/api/QNR/${id||''}`);
    return response;
  })

export const updateQNR = createAsyncThunk(
  'manage/updateQNR',
  async (exam: any, { rejectWithValue }) => {
    const formExam = new FormData();
    Object.keys(exam).forEach(k => {
      let value = exam[k];
      if (Array.isArray(value)) {
        formExam.append(`j${k}`, JSON.stringify(value))
        console.log(`updateQNR j${k}`, JSON.stringify(value));
      } else {
        value = value instanceof Date ? value.toISOString() : value
        value && formExam.append(k, value);
      }
    })
   
    try {
      const response = await client.post('/api/updateQNR', formExam)
      console.log("updateQNR 2 ", response);
      return response
    } catch (err) {
      console.log("updateExam err,", err);

      return rejectWithValue(err)
    }
  }
)

export const copyQNR = createAsyncThunk(
  'manage/copyQNR',
  async (qnrid: number) => {
    const response = await client.get(`/api/copyQNR/${qnrid}`)
    console.log("copyQNR response");
    return response
  }
)

export const deleteQNR = createAsyncThunk(
  'manage/deleteQNR',
  async (qnrid: number) => {
    const response = await client.get(`/api/deleteQNR/${qnrid}`)
    console.log("deleteQNR response");
    return response
  }
)

export const manageSlice = createSlice({
  name: 'manage',
  initialState,  
  reducers: {
    questAdded: (state, action) => {
      const [quest, questlist] = action.payload;     
      console.log("quest, questlist", quest, questlist);
    },
    questListReset: manageAdapter.setAll,
    questDeleted: manageAdapter.removeOne,
    copyQuest: (state, action) => {
      const [quest, questlist] = action.payload;
      console.log("quest, questlist", quest, questlist);
    },
    deleteQuest: manageAdapter.removeOne,
    updateQuestList: (state, action) => {
      //const { questList } = action.payload;
      //console.log("updateQuestList", action.payload, questList);
      state.QNRObj.questList = action.payload;
    },
    updateQNRObj: (state, action) => {
      // const { QNRObj } = action.payload;
      console.log("updateQNRObj", action.payload)
      state.QNRObj = action.payload;
    },
    addNewQuest: manageAdapter.addOne,
    questUpdated: (state, action) => {
      const { questPId, newvalue } = action.payload;
      manageAdapter.updateOne(state, { id: questPId, changes: action.payload });
    },
    
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(initCodeValues.fulfilled, (state, action) => {
        console.log("initCodeValues.action.payload", action.payload);
        state.questTypeList = action.payload;
      })
      .addCase(fetchQNRList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQNRList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("fetchQNRList.action.payload", action.payload);
        manageAdapter.setAll(state, action.payload);
      })      
      .addCase(fetchQNR.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQNR.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("fetchQNR.action.payload", action.payload);
        state.QNRObj = action.payload;

      })  
  },
});

export const { 
  questAdded,
  questListReset,
  updateQuestList,
  updateQNRObj,
  addNewQuest,
  copyQuest,
  deleteQuest,
} = manageSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
//export const selectQuest = (state: RootState) => state.quest.entities;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.


export default manageSlice.reducer;


//export const questSelectors = questAdapter.getSelectors<RootState>(
//  (state) => state.quest
//)

export const {
  selectAll: selectQNRList,
  selectById: selectQNRById,
  selectIds: selectQNRIds,
} = manageAdapter.getSelectors<RootState>((state) => state.manage)


export const selectQNRObj= state => state.manage.QNRObj;
export const selectQuestList = (state) => state.manage.QNRObj.questList;
export const selectStatus = state => state.manage.status;
export const selectErrors = state => state.manage.errors;
export const selectQuestTypeList = state => state.manage.questTypeList;