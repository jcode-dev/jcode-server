"use strict";

var restapi = {};

restapi.base_url = location.protocol+"//"+location.host+"/api/";

restapi.axios = axios.create({ baseURL: restapi.base_url });

// axios with token
restapi.axios.interceptors.request.use((config) => {
	var token = localStorage.getItem('token');
  if (token) {  
    config.headers.Authorization = `Bearer ${token}`
    return config
  }
  return config
}, function (error) {
  return Promise.reject(error)
});

restapi.get = function(api) {
	return restapi.axios.get(restapi.base_url+api);
}
restapi.post = function(api, data) {
	return restapi.axios.post(restapi.base_url+api, data);
}
restapi.delete = function(api) {
	return restapi.axios.delete(restapi.base_url+api);
}
