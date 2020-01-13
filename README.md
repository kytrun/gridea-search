# [Gridea](https://github.com/getgridea) 静态站点客户端-文章搜索主题插件


**预览：<https://tangkaichuan.cn> ，或者克隆此项目到本地置于Gridea的themes路径，自行运行Gridea.**



## 特点:

* ### 本地缓存索引，加快搜索速度

* ### 独立搜索结果页面，可高度复用post-list模板

* ### 延用官方API，无附加学习成本

* ### 自定义



## 插件安装：

### 1. 以官方 [主题开发样板](https://github.com/getgridea/gridea-theme-starter) 为例，在其基础上新增文件：

```
 ├── assets
 │   └── media
 │       └── gridea-search
 │           ├── ejs.min.js - 用于浏览器的ejs模板解析器
 │           ├── fuse.js - 用于前端模糊搜索的工具
 │           ├── gridea-search.js - 主要功能
 │           └── result-template.ejs - 搜索结果展示页的 ejs 模板，基本可复用原有 post-list.ejs
 └── templates
     ├── api-content.ejs - 输出文章内容的api
     ├── api-info.ejs - 输出整站配置信息的api，不含文章内容
     └── search.ejs - 搜索页面
```
### 2. 修改以下文件

#### (1) ./templates/includes/header.ejs

在适当位置添加搜索输入框：

```html
<form id="gridea-search-form" data-update="<%=site.utils.now%>" action="/search/index.html">
  <input name="q" />
</form>
```

现有部分不可修改，但可以添加 class 或 style 等其他属性。

**\* 特别说明：hearder.ejs 只是页面公共部分的示例，可修改，但搜索页面模板：search.ejs 中需要包含`id="gridea-search-form" data-update="<%=site.utils.now%>"`的标签，否则缓存功能无效，搜索性能下降。**



#### (2) ./assets/media/gridea-search/result-template.ejs

此文件是用于搜索结果的展示页面模板，在浏览器解析，基本复用 ./templates/includes/post-list.ejs，但修改了摘要内容 `<%- post.abstract %>` 为 `<%- post.searchedPreview %>`，用于含关键词的搜索结果预览。



## 自定义：

### 1. 显示搜索中和无搜索结果

```
<p class="searching">搜索中......</p>
<p class="no-result" style="display:none">未搜索到相关文章</p>
```

* **不强制使用 `<p>` 标签，可以用 `<div>` 等添加加载动画。**

### 2. 搜索输入框

```
<form id="gridea-search-form" data-update="<%=site.utils.now%>" action="/search/index.html">
  <input name="q" />
</form>
```

* **保留已有属性如class、id等，可新增属性。**

### 3. 关键词高亮

```html
<style>
   .searched-keyword {
     /*You own css here*/
    }
</style>
```



## 其他：

* [官方目录结构与页面变量说明](https://github.com/getgridea/site/blob/master/docs/theme-structure.md)

* 第三方库：

  * 前端模糊搜索 - Fuse.js: <https://github.com/krisk/fuse>

  * 模板解析 - EJS: <https://github.com/mde/ejs>

* 开源协议：MIT
