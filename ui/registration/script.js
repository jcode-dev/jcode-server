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

const showerror = function(error) {
	console.log("error:",error);
	console.log("error:",error.response.data);
	document.getElementById("errormsg").innerHTML = error.response.data;
}


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
const yobi= new Array("日","月","火","水","木","金","土");

const app = new Vue({
	el: '#app',
	components: {
		itemcomp: itemcomp,
	},
	data: {
		item:{
			title: '保護者',
			children:[{
				name:'',
				title:'',
			}],
		},
		event:{name:'aaaa'},
		children:[],
		user: {},
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
			
			var that = this;
			var vars = restapi.getUrlVars();
			this.event._id = vars.eventid;
			console.log(this.event._id);
			restapi.get("event/"+this.event._id).then((response) => {
				that.event = response.data;
/*			
				this.event = response.data;
				let date = new Date(this.event.startDatetime);
				this.event.startDate = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日（'+yobi[date.getDay()]+'）';
				this.event.startTime = date.getHours()+'時'+date.getMinutes()+'分';
				date = new Date(this.event.endDatetime);
				this.event.endTime = date.getHours()+'時'+date.getMinutes()+'分';
*/
				console.log("event:", response);
			});


			restapi.get("user/whoami/").then((response) => {
				that.user = response.data;
				restapi.get("user/children/").then((response) => {
					that.children = response.data;
					console.log("contact:", response);
				});
			}).catch(function(err){
				that.user = null;
				showerror(err);
			});
/*

			axiosToken.get(base_url+"user/whoami/").then((response) => {
				var item = response.data;
				var $this = this;
				item.children = [];
				axiosToken.get(base_url+"user/children/").then((response) => {
					item.children = response.data;
					$this.item = item;
					console.log("children:", $this.item);
				});
			});
*/
		},

		// item 書込み
		form_submit: function() {
			axiosToken.post(base_url+"registration/" , this.item).then((response) => {
				console.log("item:", response);
			});
		},

	}
})

