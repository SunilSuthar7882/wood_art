"use client";

import { Routes } from "@/config/routes";
import { deleteAllLocalStoreData } from "@/helpers/Cookies/cookiesHelper";
import { useToken } from "@/helpers/Cookies/use-token";
import { removeLocalStorageItem } from "@/helpers/localStorage";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authorizationAtom } from "../authorization-atom/authorization-atom";
import Cookies from "js-cookie";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);

  function handleLogout() {
    setToken("");
    setAuthorized(false);
    deleteAllLocalStoreData();
    removeLocalStorageItem("userName");
    queryClient.clear();
    router.push(Routes.homepage);
    router.refresh();
    Cookies.remove("edit-recipe-id");
  }
  return {
    mutate: handleLogout,
  };
}
