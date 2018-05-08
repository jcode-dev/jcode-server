"use strict";

/*
		change_zip: function(event) {
			console.log("joiiojoij",this.item.zipcode);
			axios.get("http://zipcloud.ibsnet.co.jp/api/search?zipcode="+this.item.zipcode).then((response) => {
				this.item.address1 = response.results.address1;
				console.log("zipcode:", response);
			});

		}
*/

function eventdescription(event) {
return "名称："+event.name+"\n"+
"日付："+ event.startDate+"\n"+
"時間："+ event.startTime+"～"+event.endTime+"\n"+
"場所："+ event.place+"\n";
}

const app = new Vue({
	el: '#app',
	data: {
		selected:'doc',
		items: [],
		_id: "",
		showing:'doc',
		item:{},
		users:[],
		user:{},
		joins: [],
		nexturl: "",
		local: restapi.local,
		adminUi: false,
		pwdDialog: false,
		signinDialog: false,
		errormsg: "",
	},
	mounted: function() {
		this.redrawAll();
	},
	methods: {
		showerror: function(error) {
			if (error && error.response) {
				console.log("error:",error.response.data);
				this.errormsg = error.response.data;
			}
		},
		// すべて書き直し
		redrawAll() {
			this.nexturl = '/go/password' + location.pathname + location.search;
			this.item = {}
			var that = this;
			console.log("redrawAll", this.nexturl);
			restapi.get("user/whoami/").then((response) => {
				this.user = response.data;
				console.log("redrawAll:", response);
				// Query文字列を見る
				var v = restapi.getUrlVars();
				var showing = v && v.doc ? v.doc : null;
				var id  = v && v.id ? v.id : null;
				if (showing && id) {
					this.showOne(showing, id);
				} else {
					this.showOne('user', this.user._id);
				}

				this.getUsers();
				this.get_items();

			}).catch(function(err){
				//that.user = null;
				console.log("whoami:", err);
				that.user = {name: null};
				that.signinDialog = true;
				that.showerror(err);
			});
		},
		// 参加申込
		attend: function(user) {
			var that = this;
			var event = this.item;
			var email = {title: "参加申込しました", body:"参加の申し込みをしました。\n\n参加者氏名："+user.fullname+"\n\n"+eventdescription(event)};
			restapi.post("join/", {
				name: user.fullname + ' ' + restapi.getShortDate(event.startDatetime),
				memberId: user._id,
				groupId: event._id}).then((response) => {
					restapi.post("email/", email);
					console.log("Join:", response);
					this.get_items(); // 一覧表示
					this.redrawItem();
			}).catch(function(err){
				that.showerror(err);
			});
		},
		// 参加キャンセル
		leave: function(join) {
			var that = this;
			var event = this.item;
			var email = {title: "参加取消しました", body:"参加の取り消しをしました。\n\n参加者氏名："+join.name+"\n\n"+eventdescription(event)};
			restapi.delete("join/"+join._id).then((response) => {
				restapi.post("email/", email);
				console.log("leave:", response);
				this.get_items(); // 一覧表示
				this.redrawItem();
			}).catch(function(err){
				console.log("leave err:", err);
				that.showerror(err);
				that.redrawItem();
			});
		},
		// SUBMIT ボタン
		submitItem: function() {
			var item = this.item;
			console.log("submitItem !!!", item);
			if (item._id) { // 更新
				restapi.post(this.showing +'/'+ item._id, item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			} else { // 新規
				restapi.post(this.showing +'/', item).then((response) => {
					console.log("item:", response);
					this.get_items(); // 一覧表示
				});
			}
		},
		// ユーザー情報
		getUsers: function() {
			var that = this;
			restapi.get("user/").then((response) => {
				that.users = response.data;
				console.log("users", that.users);
			}).catch(function(err){
				that.users = [];
				that.showerror(err);
			});
		},
		// 一覧表示
		get_items: function() {
			var that = this;
			console.log("find:", this.selected );
			//console.log("find:", this.url );
			restapi.get(this.selected + "/").then((response) => {
				that.items = response.data;
				console.log("contact:", response);
			}).catch(function(err){
				that.items = [];
				that.showerror(err);
			});

		},
		// 右画面のデータ書き直し
		redrawItem: function() {
			console.log("redrawItem:", this._id);
			restapi.get(this.showing +'/'+ this._id).then((response) => {
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
						this.showerror(err);
						this.item = item;
					});
				} else {
					this.item = item;
				}
				this.getUsers();
			});
		},
		// 右に１つ表示
		showOne: function(doc, id) {
			console.log("showOne:", id);
			this.item = {};
			this.showing = doc;
			this._id = id;
			this.redrawItem();
		},

		// item 編集
		edit_item: function(item) {
			if (item.__t === 'Event') {
				this.showing = 'event';
			} else if (item.__t === 'User') {
				this.showing = 'user';
			} else if (item.__t === 'Join' && this.adminUi) {
				this.showing = 'join';
			} else if (item.__t === 'Join') {
				this.showing = 'event';
				item._id = item.groupId;
			} else {
				this.showing = 'doc';
			}
			this._id = item._id;
			this.redrawItem();
		},
		// 新ユーザー作成
		newuser: function(item) {
			this.showing = 'user';
			this._id = null;
			this.item = {};
		},
		// パスワードダイアログを出す
		openPasswordDlg: function() {
			this.pwdDialog = true;
		},
		closePasswordDlg: function() {
			this.pwdDialog = false;
		},
		// パスワード変更
		changepass_child: function(item) {
			this.pwdDialog = false;
			restapi.post("user/password/", item).then((response) => {
				console.log("password:", response);
			}).catch(function(err){
				this.user = {name: null};
				this.showerror(err);
			});
		},
		// 削除(管理者用)
		delete_item: function(item) {
			console.log("delete:", item);
			restapi.delete(this.selected + "/" + item._id).then((response) => {
				console.log("item:", response);
				this.get_items(); // 一覧表示
				this.redrawItem();
			});
		},
		// 新規作成(管理者用)
		create_item: function() {
			console.log("crear id:", this.item._id);
			restapi.get(this.selected + "/" + 'schema').then((response) => {
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
		// サインイン(一般用)
		signin: function(user) {
			var that = this;
			restapi.post("user/signin", {email:user.email, password: user.password}).then((response) => {
				console.log("signin:", response.data);
				this.signinDialog = false;
				restapi.pushToken(response.data);
				this.redrawAll();
			}).catch(function(err){
				that.showerror(err);
			});
		},
		// サインイン(管理者用)
		adminSinin: function(email, password = "") {
			restapi.post("user/signinadmin", {email:email, password: password}).then((response) => {
				restapi.pushToken(response.data);
				this.redrawAll();
			});
		},
		// サインアウト(管理者用)
		adminSinout: function() {
			restapi.popToken();
			this.redrawAll();
		},
	}
})
