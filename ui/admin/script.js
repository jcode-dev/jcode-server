"use strict";

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

/*
 * ユーザー情報
 */
Vue.component('user-component', {
  template: '#template-user',
	props: [
		'item',
	],
	methods: {
		child_form_submit: function(event) {
			// update if not canceled
			console.log("submit_from_child", this.item._id);
			this.$emit('submit_from_child', this.item);
		},
		changepass_child: function(event) {
			// update if not canceled
			console.log("changepass_2", this.item._id);
			this.$emit('changepass_2', this.item);
		},
		// item 新規作成
		newuser: function() {
			this.item = {};
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
/*
			axios.get("http://zipcloud.ibsnet.co.jp/api/search?zipcode="+this.item.zipcode).then((response) => {
				this.item.address1 = response.results.address1;
				console.log("zipcode:", response);
			});
*/
		}
	},
});

Vue.component('event-component', {
  template: '#template-event',
	props: [
		'item',
		'users',
	],
	methods: {
		attend: function(user) {
			var event = this.item;
			//console.log("ATTEND:", event);
			//console.log(user);
			restapi.post("join/", {
				name: user.fullname + ' ' + restapi.getShortDate(event.startDatetime),
				memberId: user._id,
				groupId: event._id }).then((response) => {
				console.log("Join:", response);
			}).catch(function(err){
				showerror(err);
			});
		},
		leave: function(join) {
			restapi.delete("join/"+join._id).then((response) => {
				console.log("item:", response);
				this.get_items(); // 一覧表示
			});
		},
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
	data: {
		selected:'doc',
		items: [],
		showing:'doc',
		item:{},
		selectedComponent: 'home-component',
		users:{},
		user:{},
		local: restapi.local,
		nexturl: "",
		joins: [],
	},
	mounted: function() {
		this.whoami();
		this.getUsers();
		this.get_items();
	},
	computed: {
		url: function() {return this.selected + "/";},
	},
	methods: {
		// ログイン情報
		whoami: function() {
			this.nexturl = '/go' + location.pathname + location.search;
			console.log("SIGNIN", this.nexturl);

			var that = this;
			restapi.get("user/whoami/").then((response) => {
				that.user = response.data;
				console.log("contact:", response);
			}).catch(function(err){
				that.user = null;
				showerror(err);
			});
		},
		getUsers: function() {
			var that = this;
			restapi.get("user/").then((response) => {
				that.users = response.data;
				console.log("users", that.users);
			}).catch(function(err){
				that.users = [];
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

			if (!(this.user.role==='ROOT')) {
				if (item.__t === 'Event') {
					this.selectedComponent = 'event-component';
					this.showing = 'event';
				} else if (! item.__t) {
					this.selectedComponent = 'user-component';
					this.showing = 'doc';
				} else if (item.__t === 'User') {
					this.selectedComponent = 'user-component';
					this.showing = 'user';
				} else if (item.__t === 'Address') {
					this.selectedComponent = 'address-component';
					this.showing = 'address';
				} else if (item.__t === 'Join') {
					this.selectedComponent = 'event-component';
					this.showing = 'event';
					item._id = item.groupId;
				} else {
					this.selectedComponent = 'home-component';
				}
			}
			restapi.get(this.showing +'/'+ item._id).then((response) => {
				var item = response.data;
				if (item.__t === 'Event') {
					item.startDate = restapi.getDate(item.startDatetime);
					item.startTime = restapi.getTime(item.startDatetime);
					item.endTime = restapi.getTime(item.endDatetime);
					restapi.get("join/?gid="+item._id).then((response) => {
						item.joins = response.data;
						this.item = item;
					}).catch(function(err){
						item.joins = [];
						showerror(err);
						this.item = item;
					});
				} else {
					this.item = item;
				}
			});
		},

		// 削除(ROOT用)
		delete_item: function(item) {
			console.log("delete:", item);
			restapi.delete(this.url + item._id).then((response) => {
				console.log("item:", response);
				this.get_items(); // 一覧表示
			});
		},
		// 新規作成(ROOT用)
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

		// パスワード変更
		changepass_child: function(item) {
			restapi.post("user/password/", item).then((response) => {
				console.log("password:", response);
			}).catch(function(err){
				that.user = null;
				showerror(err);
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
/*
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
*/

	}
})
