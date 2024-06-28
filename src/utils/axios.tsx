import axios from "axios";
import { IResponses } from "../interfaces/responses";
import cookies from "js-cookie";
const _get = async (url: string) => {
  const token = cookies.get("token");
  const res: any = axios.get(url, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`},
  });
  return res;
};
const _post = async (url: string, body?: any): Promise<IResponses<any>> => {
  return new Promise((resolve) => {
    axios.post(url, body, { proxy: false }).then(
      async (result) => {
        resolve(result.data);
      },
      (error) => {
        resolve(error);
      }
    );
  });
};

const _postFile = async (url: string, body?: any): Promise<IResponses<any>> => {
  return new Promise((resolve) => {
    axios
      .post(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        proxy: false,
      })
      .then(
        async (result) => {
          resolve(result.data);
        },
        (error) => {
          resolve(error);
        }
      );
  });
};

const _patchFile = async (
  url: string,
  body?: any
): Promise<IResponses<any>> => {
  return new Promise((resolve) => {
    axios
      .patch(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        proxy: false,
      })
      .then(
        async (result) => {
          resolve(result.data);
        },
        (error) => {
          resolve(error);
        }
      );
  });
};

export { _get, _patchFile, _post, _postFile };
