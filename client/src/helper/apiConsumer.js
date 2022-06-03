import request from './request';
import appConfig from '../config/app';

export default (endpoint, options = {}) => {
  const headers = {
    Authorization: `Bearer ${appConfig.accessToken}`,
    ...options.headers || {},
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return request(`${endpoint}`, {
    ...options,
    headers,
  });
};
