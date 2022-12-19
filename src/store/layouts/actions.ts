import { AppThunk } from "@/store";

//Reducer
import { layoutsReducer } from ".";

//Tools
import api from "@/api";

//Actions from reducer
export const { setFiles, addFile, destroyFile } = layoutsReducer.actions;

//Actions from actions
export function uploadFile(form: FormData): AppThunk {
  return async (dispatch, getState) => {
    try {
      const newFile = await api.post("/admin/files", form, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(addFile(newFile.data.file));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}

export function deleteFile(fileId: string): AppThunk {
  return async (dispatch, getState) => {
    try {
      await api.delete(`/admin/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      dispatch(destroyFile(fileId));
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };
}
