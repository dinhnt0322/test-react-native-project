import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import moment from 'moment';

const qs = require('qs');

const interactAPIServices = () => {
  axios.interceptors.response.use(
    async response => {
      return response;
    },
    async error => {
      const {config, response, message} = error || {};
      const {status, data} = response || {};
      if (
        status === 401 ||
        message?.indexOf('401') > -1 ||
        data?.error?.code === 401
      ) {
        if (!config.retry) {
          config.retry = true;
          // provide refresh user token if have 401 error
          return axios(config);
        }
      }
      return Promise.reject(error);
    },
  );

  const cacheData:
    | {
        [key in string]: {data: AxiosResponse | null; timeMakeRequest: number};
      } = {};

  const TIME_TO_CACHE = 5;

  async function fetch({
    url,
    method,
    data,
    isQuery,
    callbackUploadProgress,
    customHeader,
  }: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data: any;
    isQuery: boolean;
    callbackUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    customHeader?: any;
  }) {
    let route = `${url}`;
    if (isQuery && data) {
      const query = qs.stringify(data);
      route = `${route}?${query}`;
      data = undefined;
    }

    const headers = Object.assign(
      {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      },
      customHeader,
    );

    const options: AxiosRequestConfig = {
      method,
      url: route,
      headers: headers,
      timeout: 30 * 1000,
    };
    if (callbackUploadProgress) {
      options.onUploadProgress = callbackUploadProgress;
    }
    if (data) {
      if (data instanceof FormData) {
        Object.assign(options, {data: data});
      } else {
        Object.assign(options, {data: JSON.stringify(data)});
      }
    }
    let resultData: AxiosResponse | null = null;
    if (cacheData && cacheData[route]) {
      if (
        moment().unix() - cacheData[route].timeMakeRequest <
        TIME_TO_CACHE * 1000
      ) {
        resultData = cacheData[route].data;
      } else {
        delete cacheData[route];
      }
    } else {
      resultData = await axios(options);
      cacheData[route] = {timeMakeRequest: moment().unix(), data: resultData};
    }
    return resultData;
  }

  type axiosInputType = {
    route: string;
    body?: any | null;
    showLoading?: boolean;
    showError?: boolean;
    callbackUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    customHeader?: any;
  };

  const GET = ({route, body, customHeader}: axiosInputType) => {
    return fetch({
      url: route,
      method: 'GET',
      data: body,
      isQuery: true,
      customHeader,
    });
  };

  const POST = ({
    route,
    body,
    customHeader,
    callbackUploadProgress,
  }: axiosInputType) => {
    return fetch({
      url: route,
      method: 'POST',
      data: body,
      isQuery: false,
      callbackUploadProgress,
      customHeader,
    });
  };

  const PUT = ({route, body, customHeader}: axiosInputType) => {
    return fetch({
      url: route,
      method: 'PUT',
      data: body,
      isQuery: false,
      customHeader,
    });
  };

  const PATCH = ({route, body, customHeader}: axiosInputType) => {
    return fetch({
      url: route,
      method: 'PATCH',
      data: body,
      isQuery: false,
      customHeader,
    });
  };

  const DELETE = ({route, body, customHeader}: axiosInputType) => {
    return fetch({
      url: route,
      method: 'DELETE',
      data: body,
      isQuery: false,
      customHeader,
    });
  };
  return {POST, GET, PUT, DELETE, PATCH};
};
const axiosServices = interactAPIServices();
export default axiosServices;
