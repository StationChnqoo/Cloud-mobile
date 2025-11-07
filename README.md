## 打包

./gradlew generateCodegenArtifactsFromSchema --rerun-tasks

``` bash
ENVFILE=.env.sit ./gradlew assembleDebug --refresh-dependencies
ENVFILE=.env.uat ./gradlew assembleRelease
```