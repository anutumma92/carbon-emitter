import 'whatwg-fetch';

if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = (event, params) => {
    const newParams = params || { bubbles: false, cancelable: false, detail: null };
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(event, newParams.bubbles, newParams.cancelable, newParams.detail);

    return e;
  };
}

const ContentType = {
  form: 'application/x-www-form-urlencoded;charset=UTF-8',
};

class RequestError extends Error {
  constructor(message, uri, options, response = null) {
    super(message);
    this.uri = uri;
    this.options = options;
    this.response = response;
  }
}

window.onunhandledrejection = (event) => {
  if (event.reason instanceof RequestError) {
    document.dispatchEvent(new CustomEvent('request.error', {
      detail: {
        uri: event.reason.uri,
        options: event.reason.options,
        response: event.reason.response,
      },
    }));
  }
};

const request = (uri, options = {}) => new Promise((resolve, reject) => {
  const newOptions = {
    ...options,
    headers: new Headers(options.headers || {}),
  };

  if (!newOptions.headers.get('content-type') && newOptions.contentType) {
    newOptions.headers.set('content-type', ContentType[newOptions.contentType]);
  }

  if (!newOptions.headers.get('x-requested-with')) {
    newOptions.headers.set('x-requested-with', 'XMLHttpRequest');
  }

  document.dispatchEvent(new CustomEvent('request.start', {
    uri,
    options: newOptions,
  }));

  return window.fetch(uri, newOptions)
    .then((response) => {
      if (response.ok) {
        resolve(response);
        document.dispatchEvent(new CustomEvent('request.success', {
          uri,
          options: newOptions,
          response,
        }));

        return;
      }
      response.clone().json().then((e) => console.error(e));
      reject(new RequestError('Server returned a non 2xx status', uri, newOptions, response));
      if (!newOptions.skipEvents) {
        document.dispatchEvent(new CustomEvent('request.error', {
          detail: { uri, options: newOptions, response },
        }));
      }
    })
    .catch((e) => {
      console.error(e);
      reject(new RequestError('Could not complete request', uri, newOptions));
      if (!newOptions.skipEvents) {
        document.dispatchEvent(new CustomEvent('request.error', {
          detail: { uri, options: newOptions },
        }));
      }
    })
    .finally(() => {
      document.dispatchEvent(new CustomEvent('request.complete', {
        uri,
        options: newOptions,
      }));
    });
});

export { RequestError };
export default request;
