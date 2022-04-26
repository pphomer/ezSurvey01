// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  let config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  // console.log("body", body);

  if (body instanceof FormData) {

    config = {
      method: 'POST',
      body: body
    }
  }
  else if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    //console.log("client response", response);
    //console.log("client response data", data);
    if (response.ok) {
      return data
    }
    //return data;
    //// let error = new Error(data);
    //// error.data = data;
    throw new Error(response.statusText)
    //throw "123456xxxx"//data
  } catch (err) {
    console.log("err", err.message, data);
    return Promise.reject(data);
    // return Promise.reject(err.message ? err.message : data);
  }
}

client.get = function (endpoint, customConfig = {}) {

  // console.log("client.get");

  return client(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}

client.postForm = async function (endpoint, formData) {
  const config = {
    method: 'POST',
    body: formData
  }

  let data
  try {
    const response = await fetch(endpoint, config)
    // console.log("response", response);
    data = await response.json()
    if (response.ok) {
      return data
    }
    throw new Error(response.statusText)
  } catch (err) {
    return Promise.reject(err.message ? err.message : data)
  }
}