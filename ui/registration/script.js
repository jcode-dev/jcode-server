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

/**
 * URL解析して、クエリ文字列を返す
 * @returns {Array} クエリ文字列
 */
function getUrlVars()
{
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
			
			var vars = getUrlVars();
			
			this.event._id = vars.eventid;
			console.log(this.event._id);
			axiosToken.get(base_url+"event/"+this.event._id).then((response) => {
				this.event = response.data;
				let date = new Date(this.event.startDatetime);
				this.event.startDate = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日（'+yobi[date.getDay()]+'）';
				this.event.startTime = date.getHours()+'時'+date.getMinutes()+'分';
				date = new Date(this.event.endDatetime);
				this.event.endTime = date.getHours()+'時'+date.getMinutes()+'分';
				console.log("event:", response);
			});

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
		},

		// item 書込み
		form_submit: function() {
			axiosToken.post(base_url+"registration/" , this.item).then((response) => {
				console.log("item:", response);
			});
		},

	}
})

