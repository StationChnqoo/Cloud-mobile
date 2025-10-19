## 打包
``` bash
ENVFILE=.env.sit ./gradlew assembleDebug --refresh-dependencies
ENVFILE=.env.uat ./gradlew assembleRelease
```