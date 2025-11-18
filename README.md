### Java

最低版本是`Java 17`，

```java
sdk use java 17.0.9-oracle
```

## 打包

./gradlew generateCodegenArtifactsFromSchema --rerun-tasks

```bash
ENVFILE=.env.sit ./gradlew assembleDebug --refresh-dependencies
ENVFILE=.env.uat ./gradlew assembleRelease
```
