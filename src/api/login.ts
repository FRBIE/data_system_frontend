// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 POST /login/ */
export async function loginCreate(options?: { [key: string]: any }) {
  return request<any>("/login/", {
    method: "POST",
    ...(options || {}),
  });
}
