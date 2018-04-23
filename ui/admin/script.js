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
		items: [],
		item:{},
		selected:'reviews',
		user:{},
	},
	mounted: function() {
		this.whoami();
	},
	computed: {
		url: function() {return base_url + this.selected + "/";},
	},
	methods: {
		// ログイン情報
		whoami: function() {
			axiosToken.get(base_url+"user/whoami/").then((response) => {
				this.user = response.data;
				console.log("contact:", response);
			});
		},
		// 一覧表示
		get_items: function() {
			console.log("contact:" );
			axiosToken.get(this.url + '').then((response) => {
				this.items = response.data;
				console.log("contact:", response);
			});
		},
		// item 編集
		edit_item: function(item) {
			console.log("edit:", item);
			axiosToken.get(this.url + item._id).then((response) => {
				this.item = response.data;
				console.log("item:", response);
			});
		},
		// item 新規作成
		create_item: function() {
			console.log("crear id:", this.item._id);
			axiosToken.get(this.url + 'schema').then((response) => {
				console.log("schema:", response.data);
				//this.item = response.data;
				for (var key in response.data) {
					if (!(key in this.item)) {
						this.item[key] = null;
					}
				}
				this.item._id = null;
			});

		},
		// item 書込み
		form_submit: function() {
			if (this.item._id) { // 更新
				console.log("write:", this.item);
				axiosToken.post(this.url + this.item._id, this.item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			} else { // 新規
				axiosToken.post(this.url , this.item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			}
		},
		// 削除
		delete_item: function(item) {
			console.log("delete:", item);
			axiosToken.delete(this.url + item._id).then((response) => {
				console.log("item:", response);
				this.get_items(); // 一覧表示
			});
		},

	}
})

