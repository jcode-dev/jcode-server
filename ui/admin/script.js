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
	],
	methods: {
		child_form_submit: function(event) {
			// update if not canceled
			console.log("submit_from_child", this.item._id);
			this.$emit('submit_from_child', this.item);
		},
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

const app = new Vue({
	el: '#app',
	components: {
		itemcomp: itemcomp,

	},
	data: {
		items: [],
		item:{},
		selected:'reviews',
		selectedComponent: 'event-component',
		user:{},
	},
	mounted: function() {
		this.whoami();
	},
	computed: {
		url: function() {return this.selected + "/";},
	},
	methods: {
		// ログイン情報
		whoami: function() {
			restapi.get("user/whoami/").then((response) => {
				this.user = response.data;
				console.log("contact:", response);
			});
		},
		// 一覧表示
		get_items: function() {
			console.log("find:", this.selected );
			console.log("find:", this.url );
			restapi.get(this.url + '').then((response) => {
				this.items = response.data;
				console.log("contact:", response);
			});
		},
		// item 編集
		edit_item: function(item) {

			if (item.__t === 'Event') {
				this.selectedComponent = 'event-component';
			} else {
				this.selectedComponent = 'home-component';
			}
			console.log("edit:", item);
			restapi.get(this.url + item._id).then((response) => {
				this.item = response.data;
				console.log("item:", response);
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
		// 削除
		delete_item: function(item) {
			console.log("delete:", item);
			restapi.delete(this.url + item._id).then((response) => {
				console.log("item:", response);
				this.get_items(); // 一覧表示
			});
		},

	}
})

