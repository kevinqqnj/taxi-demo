TEST only
##Django + Rest Framework + Channels

https://testdriven.io/courses/real-time-app-with-django-channels-and-angular/part-one-getting-started/

```
curl -i -d '{"username":"user1", "password":"aaa"}' -H 'Content-Type: application/json' localhost:8000/api/log_in/
```

```
curl -i --no-buffer -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: 4hGLVuU0DthZWQlMbzvvDg==" -H "Sec-WebSocket-Version: 13" -H "cookie: sessionid=ztupjmv2cmpggjw40e1ur8rmrgsmo2qs" localhost:8000/taxi/
```

