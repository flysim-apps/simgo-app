import { configureStore } from '@reduxjs/toolkit';
import mapsReducer from 'features/maps';

export const store = configureStore({
  reducer: {
    maps: mapsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
