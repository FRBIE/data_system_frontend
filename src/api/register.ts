// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 POST /register/ */
export async function registerCreate(options?: { [key: string]: any }) {
  return request<any>("/register/", {
    method: "POST",
    ...(options || {}),
  });
}
