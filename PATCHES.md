# 本地改动记录（0.37.2 基线）

## 补丁位置

1. **宠物联动**：`src/client/services/player/player.js` 的 `onPlay` 里调用 `notifyPetMusic()`
   - 调 `/dsh-pet-7340/anim` 播「歌姬变身」，再 `/broadcast` 冒「这首歌不错～」（`anim:false`）
2. **输入框波形 + 上一首/下一首**：`src/client/components/ui/composer.js`
   - `ComposerWave` 组件 + `ComposerCluster` 里新增 prev/next 按钮
3. **波形样式**：`src/client/styles/theme.js`（`.mp-composer-wave`）
4. 构建：`node scripts/build-client.mjs`

## 注意

- **缓存上限**不再用 `cacheMaxBytes` 配置：0.37.2 改为设置项「设置 → 数据 → 缓存歌曲 → 上限」，直接选 2 GB 即可
- 依赖装在插件目录自己的 `node_modules`（`link:` 安装不会自动装它的依赖），升级后要 `pnpm install`
- 构建产物 `client.js` 必须一起提交；改完源码要重新 build
- 改完**完整重启 DSH** 才生效
