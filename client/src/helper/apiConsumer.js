import request from './request';
import appConfig from '../config/app';

export default (endpoint, options = {}) => {
  const headers = {
    'Accept-Language': 'en_US',
    Authorization: `Bearer ${appConfig.accessToken}`,
    ...options.headers || {},
  };
console.log(headers, options)

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return request(`${appConfig.apiHost}${endpoint}`, {
    ...options,
    headers,
  });
};
