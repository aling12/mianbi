import request from "../utils/request";

export function getUsers(params = {}) {
  return request({
    method: "GET",
    url: "/users",
    params,
  });
}
