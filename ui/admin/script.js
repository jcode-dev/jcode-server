"use strict";

var itemcomp = {
	template: '#template-task-item',
	props: [
		'item',
	],
	methods: {
		edit_click: function(event) {
			// update if not canceled
			console.log(this.item);
			this.$emit('edit_item', this.item);
		},
		edit_click22: function(event) {
			// update if not canceled
			console.log(this.item);
			this.$emit('edit_item22', this.item);
		},
		delete_click: function(event) {
			// update if not canceled
			console.log(this.item);
			this.$emit('delete_item', this.item);
		},
	},
};

Vue.component('home-component', {
  template: '#template-home',
	props: [
		'item',
		'local',
	],
	methods: {
		child_form_submit: function(event) {
			// update if not canceled
			console.log("submit_from_child", this.item._id);
			this.$emit('submit_from_child', this.item);
		},
	},
});

Vue.component('doc-component', {
  template: '#template-doc',
	props: [
		'item',
	],
	methods: {
		child_form_submit: function(event) {
			// update if not canceled
			console.log("submit_from_child", this.item._id);
			this.$emit('submit_from_child', this.item);
		},
	},
});

Vue.component('address-component', {
  template: '#template-address',
	props: [
		'item',
	],
	methods: {
		child_form_submit: function(event) {
			// update if not canceled
			console.log("submit_from_child", this.item._id);
			this.$emit('submit_from_child', this.item);
		},
		change_zip: function(event) {
			console.log("joiiojoij",this.item.zipcode);
			axios.get("http://zipcloud.ibsnet.co.jp/api/search?zipcode="+this.item.zipcode).then((response) => {
				this.item.address1 = response.results.address1;
				console.log("zipcode:", response);
			});
		}
	},
});

Vue.component('event-component', {
  template: '#template-event',
	props: [
		'item',
	],
	methods: {
		child_form_submit: function(event) {
			// update if not canceled
			console.log("submit_from_child", this.item._id);
			this.$emit('submit_from_child', this.item);
		},
	},
});

const showerror = function(error) {
	console.log("error:",error);
	console.log("error:",error.response.data);
	document.getElementById("errormsg").innerHTML = error.response.data;
}

const app = new Vue({
	el: '#app',
	components: {
		itemcomp: itemcomp,

	},
	data: {
		items: [],
		item:{},
		selected:'doc',
		selectedComponent: 'event-component',
		user:{},
		local: restapi.local,
	},
	mounted: function() {
		this.whoami();
		this.get_items();
	},
	computed: {
		url: function() {return this.selected + "/";},
	},
	methods: {
		// ログイン情報
		whoami: function() {
			var that = this;
			restapi.get("user/whoami/").then((response) => {
				that.user = response.data;
				console.log("contact:", response);
			}).catch(function(err){
				that.user = null;
				showerror(err);
			});
		},
		// 一覧表示
		get_items: function() {
			var that = this;
			console.log("find:", this.selected );
			console.log("find:", this.url );
			restapi.get(this.url + '').then((response) => {
				that.items = response.data;
				console.log("contact:", response);
			}).catch(function(err){
				that.items = [];
				showerror(err);
			});
		},
		// item 編集
		edit_item: function(item) {

			if (item.__t === 'Event') {
				this.selectedComponent = 'event-component';
			} else if (! item.__t) {
				this.selectedComponent = 'doc-component';
			} else if (item.__t === 'Address') {
				this.selectedComponent = 'address-component';
			} else {
				this.selectedComponent = 'home-component';
			}
			console.log("edit:", item);
			restapi.get(this.url + item._id).then((response) => {
				this.item = response.data;
				console.log("item:", response);
			});
		},
		edit_item22: function(item) {
			this.selectedComponent = 'home-component';
			restapi.get(this.url + item._id).then((response) => {
				this.item = response.data;
			});
		},
		// 削除
		delete_item: function(item) {
			console.log("delete:", item);
			restapi.delete(this.url + item._id).then((response) => {
				console.log("item:", response);
				this.get_items(); // 一覧表示
			});
		},
		// item 新規作成
		create_item: function() {
			console.log("crear id:", this.item._id);
			restapi.get(this.url + 'schema').then((response) => {
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
		// 子コンポーネントよりitem 書込み
		child_form_submit: function(item) {
			console.log("write:",item);
			if (item._id) { // 更新
				restapi.post(this.url + item._id, item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			} else { // 新規
				restapi.post(this.url , item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			}
		},
		// item 書込み
		form_submit: function(item) {
			if (this.item._id) { // 更新
				console.log("write:", this.item);
				restapi.post(this.url + this.item._id, this.item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			} else { // 新規
				restapi.post(this.url , this.item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			}
		},

	}
})

