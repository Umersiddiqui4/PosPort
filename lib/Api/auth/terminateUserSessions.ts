"use client";

import api from "@/utils/axios";
import type { AxiosResponse } from "axios";

export interface TerminateUserSessionsRequest {
  userId: string;
}

export interface TerminateUserSessionsResponse {
  data: {
    message: string;
  };
}

export const terminateUserSessions = async (data: TerminateUserSessionsRequest): Promise<TerminateUserSessionsResponse> => {
  const response: AxiosResponse<TerminateUserSessionsResponse> = await api.post(
    `/auth/terminate-user-sessions`,
    data
  );
  return response.data;
};
