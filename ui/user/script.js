"use strict";

const url = location.protocol+"//"+location.host+"/api/";
// axios with token
const axiosToken = axios.create({ baseURL: url });
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

var About = {
	template: '#about-component',
	props: [],
	data: function() {
		return {
			message: "こんにちは",
			next: 'next',
			newurl: '',
			location: {},
			id: '',
			user:{},
		}
	},
	mounted: function() {
		this.whoami();
	},
	methods: {
		// ログイン情報
		whoami: function() {
			this.location = location;
			this.id = this.$route.query.id;
			this.id = this.$route.fullPath;
			this.newurl = "href='/ui/event/"+this.location.search+"'";

			var $this = this;
			axiosToken.get(url+"user/whoami/").then((response) => {
				$this.user = response.data;
				console.log("I am :", response);
			}).catch(function(error) {
				console.log('whoami err!', error);
				$this.message = "サインインが必要です";
			});
		},
		submitfunc: function() {
			if (this.next === 'next') {
				this.$router.push('/');
				//router.push('dashboard');
				//let newurl = "/ui/event/1111111111";
				//setTimeout(function(){location.href = newurl;},500);
			} else {
				//router.push('signin');
				router.push({ path: 'signin', query: { id: '11234' }})
			}
		},
	}
};

var SendEmail = {
	template: '#sendemail-component',
	data: function() {
		return {
			message: "こんにちは",
			user:{},
		}
	},
	mounted: function() {
	},
	methods: {
		submitfunc: function() {
			var $this = this;
			axiosToken.post(url+"user/sendemail", this.user).then((response) => {
				$this.user = response.data;
				router.push('signup');
			}).catch(function(error) {
				console.log('signup err!', error);
				$this.message = "そのメールアドレスは既に登録されているようです。\n別のメールアドレスにするか、パスワードのリセットを行ってください。";
			});

		},
	}
};
var Signup = {
	template: '#signup-component',
	data: function() {
		return {
			message: "メールに記載の秘密の番号を使って、登録を完了してください。",
			user:{},
		}
	},
	mounted: function() {
	},
	methods: {
		submitfunc: function() {
			this.$emit('childs-event', this.user)
			//console.log("signup:", this.user);
			if (this.user.password !== this.user.password2) {
				//this.class_password = true;
				this.message = '同じパスワードを入れてください'
				console.log("signup:", "err");
				return;
			}
			console.log("signup:", "ok");
			var $this = this;
			axiosToken.post(url+"user/signup", this.user).then((response) => {
				$this.user = response.data;
				console.log("signup:", response);
				router.push('signin');
			}).catch(function(error) {
				console.log('signup err!', error);
				$this.message = "このメールアドレスは、既に使われています。\n別のメールアドレスにするか、パスワードのリセットを行ってください。";
			});

		},
	}
};

var Signin = {
	template: '#signin-component',
	props: ["val"],
	data: function() {
		return {
			message: "サインインしてください。",
			user:{},
		}
	},
	methods: {
		submitfunc: function (e) {
			var $this = this;
			this.$emit('childs-event', this.user)
			axios.post(url+"user/signin", this.user).then((response) => {
				console.log("confirmed signin:", response);
				var user = response.data;
				console.log(user);
				localStorage.setItem('token',user);
				$this.message = "サインインに成功しました。";
			}).catch((error) => {
				 console.log("signin:",error);
				$this.message = "サインインに失敗しました。";
			});
		}
  },
};

var Dashboard = { template: '<h1>Dashboard</h1>' };

var Auth = {
  loggedIn: false,
  login: function() { this.loggedIn = true },
  logout: function() { this.loggedIn = false }  
};

var Login = {
  template: '#login-component',
  methods: {
    login: function() {
      Auth.login();
      router.push(this.$route.query.redirect);
    }
  }
};

const routes = [
  { path: '/', component: About },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true }},
  { path: '/sendemail', component: SendEmail },
  { path: '/signin', component: Signin },
  { path: '/signin/:id', component: Signin },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/:id', component: About },
];

var router = new VueRouter({
	//mode: 'history',
	routes: routes
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth) && !Auth.loggedIn) {

		//let newurl = "/ui/event/?aa=1111111111";
		//setTimeout(function(){location.href = newurl;},500);
		next({ path: '/login', query: { redirect: to.fullPath }});
	} else {
		next();
	}
});

var app = new Vue({
  el: '#app',
  methods: {
		parentsMethod: function(data) {
			this.puser = data;
			this.pmail = data.email;
			console.log(data);
		}
	},
  data: {
		puser: {},
		pmail: '',
	},
  router
});
