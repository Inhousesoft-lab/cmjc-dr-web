import { createSlice } from '@reduxjs/toolkit'
import { selectOrgchtList, getOrgcht, insertOrgcht, updateOrgcht, saveOrgcht, deleteOrgcht } from './OrgchtThunks'
import { mockOrgchtList, OrgchtPVO, OrgchtRVO, OrgchtListPVO, OrgchtListRVO, OrgchtDVO  } from './OrgchtTypes'

/**
 * 대국민포털_KIDS조직도기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface OrgchtState {
  list: OrgchtRVO[]
  totalCount: number | null
  current: OrgchtRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_KIDS조직도기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: OrgchtState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const OrgchtSlice = createSlice({
  name: 'orgcht',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectOrgchtList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectOrgchtList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectOrgchtList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getOrgcht.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getOrgcht.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getOrgcht.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertOrgcht.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertOrgcht.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertOrgcht.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Orgcht';
      })
      .addCase(updateOrgcht.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrgcht.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateOrgcht.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Orgcht';
      })
      .addCase(saveOrgcht.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOrgcht.fulfilled, (state, action) => {
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
      .addCase(saveOrgcht.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Orgcht';
      })
      .addCase(deleteOrgcht.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrgcht.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteOrgcht.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Orgcht';
      })
  }
});

export const { clearCurrent } = OrgchtSlice.actions
export default OrgchtSlice.reducer
