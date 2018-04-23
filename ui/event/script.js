"use strict";

const base_url = location.protocol+"//"+location.host+"/api/";
// axios with token
const axiosToken = axios.create({ baseURL: base_url });
axiosToken.interceptors.request.use((config) => {
	var token = localStorage.getItem('token');
  if (token) {  
    config.headers.Authorization = `Bearer ${token}`
    return config
  }
  return config
}, function (error) {
  return Promise.reject(error)
});


var itemcomp = {
	template: '#template-task-item',
	props: [
		'item',
	],
	methods: {
		edit_click: function(event) {
			// update if not canceled
			console.log(this.item);
			this.$emit('edit_item',{_id: this.item._id});
		},
		delete_click: function(event) {
			// update if not canceled
			console.log(this.item);
			this.$emit('delete_item',{_id: this.item._id});
		},
	},
};

const app = new Vue({
	el: '#app',
	components: {
		itemcomp: itemcomp,
	},
	data: {
		item:{
			startDatetime:'a',
		},
		user: {},
	},
	mounted: function() {
		this.whoami();
	},
	computed: {
		url: function() {return base_url + this.selected + "/";},
		startDatetime: function() {
			this.item.startDatetime = this.item.startDate +' '+ this.item.startTime;
			return this.item.startDatetime;
		},
		endDatetime: function() {
			this.item.endDatetime = this.item.endDate +' '+ this.item.endTime;
			return this.item.startDatetime;
		},
		
	},
	methods: {
		// ログイン情報
		whoami: function() {
			axiosToken.get(base_url+"user/whoami/").then((response) => {
				this.user = response.data;
				console.log("contact:", response);
			});
		},

		// item 書込み
		form_submit: function() {
			axiosToken.post(base_url+"event/" , this.item).then((response) => {
				console.log("item:", response);
			});
		},

	}
})

