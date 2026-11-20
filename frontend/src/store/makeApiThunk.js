import { createAsyncThunk } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/helpers/apiError";

// Thin wrapper around createAsyncThunk so every thunk shares the same
// try / catch / rejectWithValue shape as the original cartSlice:
//   success -> the response body is the fulfilled payload
//   failure -> the server's error message (or `fallback`) is the rejected payload
export const makeApiThunk = (type, request, fallback, options) =>
  createAsyncThunk(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        const response = await request(arg);
        return response.data;
      } catch (error) {
        return rejectWithValue(getApiErrorMessage(error, fallback));
      }
    },
    options,
  );

// Same as makeApiThunk, but after a successful write it dispatches the action
// returned by `refresh(state, payload, arg)` (usually "re-fetch the list with the
// params it was last loaded with"). This is how the database stays the single
// source of truth now that there is no RTK Query tag invalidation.
export const makeWriteThunk = (type, request, fallback, refresh) =>
  createAsyncThunk(type, async (arg, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await request(arg);
      const actions = refresh ? [].concat(refresh(getState(), response.data, arg)) : [];
      actions.filter(Boolean).forEach((action) => dispatch(action));
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, fallback));
    }
  });
