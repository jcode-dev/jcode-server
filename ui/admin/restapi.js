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

restapi.local = {
	_id: 'ID',
	role: '役割',
	number:'番号',
	name:'名前',
	email:'メール',
	updatedAt:'更新日付',
	createdAt:'作成日付',

	Address: '<i class="far fa-address-card"></i>',
	EventRegistration: '<i class="far fa-calendar-check"></i>',
	Event: '<i class="far fa-calendar-alt"></i>',
	User: '<i class="fas fa-child"></i>',
};

