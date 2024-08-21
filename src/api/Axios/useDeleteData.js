import baseUrl from "../../api/BaseUrl";

export const DeleteData = async (url, payload) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const res = await baseUrl.delete(url, { data: payload }, config);
  return res;
};
