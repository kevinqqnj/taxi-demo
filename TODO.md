

[] after setUserInfo, if user session expired, how to detect and redirect?
 - response: 403 Forbidden, {"detail":"身份认证信息未提供。"}
 - interception => clear localStorage.user
 - How to test: Application -> Cookie -> delete "sessionid"

[x] '/vue' meta.auth => redirect to 'login' => submit login => next: works!
 - fixed by read localStorage

[] current path: '/vue' => reload => django return '/' => main.js push '/vue'
  BUT router redirect to '/login'??

[] Vuex Global Notification component:
 - error
 - Info (no need dismiss)
 - how to stack? for-each a list

[] logout: clear localStorage + clear Cookie (sessionid is in Cookie!)


[] onCreate => when localStorage.getItem('user') => show logOut/profile
    else: show logIn/singUp

[] store.error ==> List?? avoid overwritten

[] user log in => save cookie: sessionid in LocalStorage

[x] ws auto use session to access authenticated view

[x] axios interception
  - all request will add correct headers
  - all response error will store.commit 'setError'

[] Websocket reconnect?
```
    created() {
      this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://127.0.0.1:8080";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        let actions = {"test":"12345"};
        this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        const redata = JSON.parse(e.data);
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },
```