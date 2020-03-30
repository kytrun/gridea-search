# [Gridea](https://github.com/getgridea) 静态站点客户端-文章搜索主题插件

**预览：<https://tangkaichuan.cn>，或者下载此项目将 `/example` 目录置于 Gridea 的 themes 路径，自行运行 Gridea.**

## 特点:

* ### 本地缓存索引，加快搜索速度

* ### 独立搜索结果页面，可高度复用 post-list 模板

* ### 延用官方 API，无附加学习成本

* ### 自定义

## 快速开始：

### 1. 以官方 [主题开发样板](https://github.com/getgridea/gridea-theme-starter) 为例，在其基础上新增文件：

```
 ├── assets
 │   └── media
 │       └── gridea-search
 │           └── result-template.ejs - 搜索结果列表模板
 └── templates
     ├── api-content.ejs - 输出文章内容的 api
     ├── api-info.ejs - 输出整站配置信息的 api，不含文章内容
     └── search.ejs - 搜索页面
```
### 2. 修改以下文件

#### (1) ./templates/includes/header.ejs

公共模板，在适当位置添加搜索框供其他页面引用：

```html
<form id="gridea-search-form" data-update="<%=site.utils.now%>" action="/search/">
  <input name="q" />
</form>
```

现有部分不可修改，可以添加 class 或 style 等其他属性。

* **搜索页面模板：search.ejs 中必须包含搜索表单 `"gridea-search-form"`。如果 search.ejs 包含了公共模板如 header.ejs，则无需额外添加。**

#### (2) ./templates/search.ejs

搜索页面，可基于其他页面修改。

#### (3) ./assets/media/gridea-search/result-template.ejs

搜索结果列表模板，在浏览器端解析，基本复用 ./templates/includes/post-list.ejs，但修改了摘要内容 `<%- post.abstract %>` 为 `<%- post.searchedPreview %>`，用于含关键词的搜索结果预览。

* **搜索结果列表暂无分页功能，请勿使用 `pagination` 字段。**

## 自定义：

### 1. 显示搜索中和无搜索结果

```html
<p class="searching">搜索中......</p>
<p class="no-result" style="display:none">未搜索到相关文章</p>
```

* **不强制使用 `<p>` 标签，可以用 `<div>` 等添加动画或图片。**

### 2. 搜索输入框

```html
<form id="gridea-search-form" data-update="<%=site.utils.now%>" action="/search/">
  <input name="q" />
</form>
```

* **保留已有属性如 class、id 等，可新增属性。**

### 3. 关键词高亮

```html
<style>
   .searched-keyword {
     /*Your own CSS for <span> tag here*/
    }
</style>
```

## 其他：

* [官方目录结构与页面变量说明](https://github.com/getgridea/site/blob/master/docs/theme-structure.md)

* 第三方库：

  * 前端模糊搜索 - Fuse.js: <https://github.com/krisk/fuse>

  * 模板解析 - EJS: <https://github.com/mde/ejs>

* 开源协议：[MIT](https://github.com/tangkaichuan/gridea-search/blob/master/LICENSE)

* 相关文章：
 
  * [给 Gridea 博客增加搜索功能](https://tangkaichuan.cn/search-for-gridea-blog/)
