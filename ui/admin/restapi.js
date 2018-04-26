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
	Join: '<i class="far fa-calendar-check"></i>',
	Event: '<i class="far fa-calendar-alt"></i>',
	User: '<i class="fas fa-child"></i>',
};

/**
 * URL解析して、クエリ文字列を返す
 * @returns {Array} クエリ文字列
 */
restapi.getUrlVars = function() {
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;

        //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
    hash  = url.slice(1).split('&');    
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');    //keyと値に分割。
        vars.push(array[0]);    //末尾にクエリ文字列のkeyを挿入。
        vars[array[0]] = array[1];    //先ほど確保したkeyに、値を代入。
    }

    return vars;
}

const yobi= new Array("日","月","火","水","木","金","土");

restapi.getDate = function(datetime) {
	let date = new Date(datetime);
	return date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日（'+yobi[date.getDay()]+'）';
}
restapi.getTime = function(datetime) {
	let date = new Date(datetime);
	return date.getHours()+':' + ('00'+date.getMinutes()).slice(-2); 
}
