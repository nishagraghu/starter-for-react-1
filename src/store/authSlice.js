import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { account } from "../lib/appwrite";
import { ID } from "appwrite";
import apiClient, { getAccessToken, setTokens, clearTokens } from "../lib/apiClient";

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const user = await account.get();
      const token = getAccessToken();
      if (token) {
        try {
          const data = await apiClient("/auth/me");
          return { appwriteUser: user, backendUser: data.data };
        } catch {
          return { appwriteUser: user, backendUser: null };
        }
      }
      return { appwriteUser: user, backendUser: null };
    } catch {
      return rejectWithValue("No active session");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      dispatch(exchangeToken({ userId: user.$id, email: user.email }));
      return { appwriteUser: user, backendUser: null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exchangeToken = createAsyncThunk(
  "auth/exchangeToken",
  async ({ userId, email }, { rejectWithValue }) => {
    try {
      const data = await apiClient("/auth/token", {
        method: "POST",
        body: { userId, email },
        auth: false,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshBackendToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiClient("/auth/refresh", { method: "POST", auth: false });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiClient("/auth/me");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name }, { rejectWithValue, dispatch }) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      dispatch(exchangeToken({ userId: user.$id, email: user.email }));
      return { appwriteUser: user, backendUser: null };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async () => {
  account.createOAuth2Session(
    "google",
    `${window.location.origin}/dashboard`,
    `${window.location.origin}/login`
  );
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      try { await apiClient("/auth/logout", { method: "POST", body: {} }); } catch {}
      await account.deleteSession("current");
      clearTokens();
      return null;
    } catch (error) {
      clearTokens();
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    backendUser: null,
    token: null,
    refreshToken: null,
    loading: true,
    error: null,
    isSuperadminTeamMember: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBackendUser: (state, action) => {
      state.backendUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => { state.loading = true; })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload.appwriteUser;
        state.backendUser = action.payload.backendUser;
        state.isSuperadminTeamMember = action.payload.backendUser?.isSuperadminTeamMember || false;
        state.loading = false;
      })
      .addCase(checkSession.rejected, (state) => {
        state.user = null;
        state.backendUser = null;
        state.isSuperadminTeamMember = false;
        state.loading = false;
        clearTokens();
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.appwriteUser;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(exchangeToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.backendUser = action.payload.user;
        state.isSuperadminTeamMember = action.payload.user?.isSuperadminTeamMember || false;
        setTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(exchangeToken.rejected, (state) => {
        state.backendUser = null;
        state.isSuperadminTeamMember = false;
        state.token = null;
        state.refreshToken = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.backendUser = action.payload;
        state.isSuperadminTeamMember = action.payload?.isSuperadminTeamMember || false;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.backendUser = null;
        state.isSuperadminTeamMember = false;
        state.token = null;
        state.refreshToken = null;
      })
      .addCase(signup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.appwriteUser;
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginWithGoogle.rejected, (state) => { state.loading = false; })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.backendUser = null;
        state.isSuperadminTeamMember = false;
        state.token = null;
        state.refreshToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.backendUser = null;
        state.isSuperadminTeamMember = false;
        state.token = null;
        state.refreshToken = null;
        state.loading = false;
      });
  },
});

export const { clearError, setBackendUser } = authSlice.actions;
export default authSlice.reducer;
