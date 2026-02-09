import { createSlice } from '@reduxjs/toolkit'
import { selectWordList, getWord, insertWord, updateWord, saveWord, deleteWord } from './WordThunks'
import { mockWordList, WordPVO, WordRVO, WordListPVO, WordListRVO, WordDVO  } from './WordTypes'

/**
 * 대국민포털_단어기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface WordState {
  list: WordRVO[]
  totalCount: number | null
  current: WordRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_단어기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: WordState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const WordSlice = createSlice({
  name: 'word',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectWordList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectWordList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectWordList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getWord.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getWord.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getWord.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertWord.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertWord.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Word';
      })
      .addCase(updateWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWord.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateWord.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Word';
      })
      .addCase(saveWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveWord.fulfilled, (state, action) => {
        state.loading = false;
        //const saved = action.payload;
        //state.current = saved || null;
        //if(saved?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(saved.id));
        //  if(idx >= 0){
        //    state.list[idx] = { ...state.list[idx], ...saved };
        //  }else if(saved) {
        //    state.list = [saved, ...state.list];
        //    state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //  }
        //}
      })
      .addCase(saveWord.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Word';
      })
      .addCase(deleteWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWord.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteWord.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Word';
      })
  }
});

export const { clearCurrent } = WordSlice.actions
export default WordSlice.reducer
