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

const showerror = function(error) {
	console.log("error:",error);
	console.log("error:",error.response.data);
	document.getElementById("errormsg").innerHTML = error.response.data;
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

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
		joins: [], //参加者一覧
	},
	mounted: function() {
		//this.redrawAll();
	},
	methods: {
		// 名簿のコピー（エクセルに貼り付ける用）
		copy: function() {
			var str = "";
			var dl = "\t";
			var er = "\n";
			for (let join of this.joins) {
				var u = join.memberId;
				str += u.number+dl +u.fullname+dl +u.furigana+dl +er;
			}
			copyToClipboard(str);
		},
		// すべて書き直し
		redrawAll: function() {
			this.whoami();
			this.getUsers();
			this.get_items();
		},
		// 参加申込
		attend: function(user) {
			var event = this.item;
			//console.log("ATTEND:", event);
			//console.log(user);
			restapi.post("join/", {
				name: user.fullname + ' ' + restapi.getShortDate(event.startDatetime),
				memberId: user._id,
				groupId: event._id }).then((response) => {
					console.log("Join:", response);
					this.get_items(); // 一覧表示
					this.redrawItem();
			}).catch(function(err){
				showerror(err);
			});
		},
		// 参加キャンセル
		leave: function(join) {
			restapi.delete("join/"+join._id).then((response) => {
				console.log("leave:", response);
				this.get_items(); // 一覧表示
				this.redrawItem();
			}).catch(function(err){
				console.log("leave err:", err);
				showerror(err);
				this.redrawItem();
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
		// アカウント情報
		whoami: function() {
			this.nexturl = '/go/password' + location.pathname + location.search;
			console.log("SIGNIN", this.nexturl);

			var that = this;
			restapi.get("user/whoami/").then((response) => {
				that.user = response.data;
				console.log("contact:", response);
			}).catch(function(err){
				//that.user = null;
				that.user = {name: null};
				that.signinDialog = true;
				showerror(err);
			});
		},
		// ユーザー情報
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
			//console.log("find:", this.url );
			restapi.get(this.selected + "/").then((response) => {
				that.items = response.data;
				console.log("contact:", response);
				if (!this.item._id) {
						this.edit_item(this.items[0]);
				}
			}).catch(function(err){
				that.items = [];
				showerror(err);
			});

		},
		// 右画面のデータ書き直し
		redrawItem: function() {
			restapi.get(this.showing +'/'+ this._id).then((response) => {
				var item = response.data;
				if (item.__t === 'Event') {
					item.startDate = restapi.getDate(item.startDatetime);
					item.startTime = restapi.getTime(item.startDatetime);
					item.endTime = restapi.getTime(item.endDatetime);
					restapi.get("join/?gid="+item._id).then((response) => {
						this.item = item;
						this.joins = response.data;

/*
						var that = this;
						var joins = response.data;
						var joinslen = joins.length;
						for (let i=0; i<joins.length; i++) {
							var join = joins[i];
							join.check = false;
							join.user = {};
							restapi.get('user/'+join.memberId).then((response) => {
								join.user = response.data;
								if (--joinslen) {
								} else {
									that.item = item;
									that.joins = joins;
								}
							});
						}
*/

					}).catch(function(err){
						thism.joins = [];
						showerror(err);
						this.item = item;
					});
				} else {
					this.item = item;
				}
				//this.getUsers();
			});
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
				showerror(err);
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
		createEvent: function() {
			this.item = {};
			this.showing = 'event';
		},
		submitEvent: function(item) {
			
			//item.startDatetime = new Date(item.startDatetime);
			//item.endDatetime = new Date(item.endDatetime);
			console.log("EVENT:", item);
			if (item._id) {
				restapi.post('event/'+item._id, item);
			} else {
				restapi.post('event/', item);
			}
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
			restapi.post("user/signin", {email:user.email, password: user.password}).then((response) => {
				this.signinDialog = false;
				restapi.pushToken(response.data);
				this.redrawAll();
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
