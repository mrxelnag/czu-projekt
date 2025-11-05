import { useMutation } from "@tanstack/react-query";

import { login, PB } from "@/lib/authentication.ts";
import { UsersRecord, UsersResponse } from "@/types/pb-types.ts";
import { C } from "@/types/db_collections.ts";
import { queryClient } from "@/lib/query-client.ts";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (user: Partial<UsersRecord>) => {
      if (!user.id) throw new Error("User ID is required");
      const response = await PB.collection(C.USERS).update(user.id, user);

      return response as UsersResponse;
    },
    onSuccess: async (data) => {
      // await PB.collection(C.USERS).authRefresh();
      await queryClient.setQueryData([C.USERS], data);
    },
    onError: (error) => {},
  });
};

// Dedicated hook for changing the current user's password
export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: async (params: {
      id: string;
      oldPassword?: string;
      password: string;
      passwordConfirm: string;
    }) => {
      const { id, ...data } = params;
      const response = await PB.collection(C.USERS).update(id, data);
      return { user: response as UsersResponse, newPassword: data.password };
    },
    onSuccess: async (data) => {
      await login(data.user.email, data.newPassword);
    },
  });
};
