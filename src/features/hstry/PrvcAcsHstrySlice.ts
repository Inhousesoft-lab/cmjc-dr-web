import { createSlice } from '@reduxjs/toolkit'
import { selectPrvcAcsHstryList, getPrvcAcsHstry, insertPrvcAcsHstry, updatePrvcAcsHstry, savePrvcAcsHstry, deletePrvcAcsHstry } from './PrvcAcsHstryThunks'
import { mockPrvcAcsHstryList, PrvcAcsHstryPVO, PrvcAcsHstryRVO, PrvcAcsHstryListPVO, PrvcAcsHstryListRVO, PrvcAcsHstryDVO  } from './PrvcAcsHstryTypes'

/**
 * 대국민포털_개인정보접근이력기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface PrvcAcsHstryState {
  list: PrvcAcsHstryRVO[]
  totalCount: number | null
  current: PrvcAcsHstryRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_개인정보접근이력기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: PrvcAcsHstryState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const PrvcAcsHstrySlice = createSlice({
  name: 'prvcAcsHstry',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectPrvcAcsHstryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectPrvcAcsHstryList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectPrvcAcsHstryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getPrvcAcsHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getPrvcAcsHstry.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getPrvcAcsHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertPrvcAcsHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertPrvcAcsHstry.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertPrvcAcsHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert PrvcAcsHstry';
      })
      .addCase(updatePrvcAcsHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrvcAcsHstry.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updatePrvcAcsHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update PrvcAcsHstry';
      })
      .addCase(savePrvcAcsHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePrvcAcsHstry.fulfilled, (state, action) => {
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
      .addCase(savePrvcAcsHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save PrvcAcsHstry';
      })
      .addCase(deletePrvcAcsHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrvcAcsHstry.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deletePrvcAcsHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete PrvcAcsHstry';
      })
  }
});

export const { clearCurrent } = PrvcAcsHstrySlice.actions
export default PrvcAcsHstrySlice.reducer
