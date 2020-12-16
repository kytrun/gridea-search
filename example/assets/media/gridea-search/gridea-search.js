/**
 * https://github.com/tangkaichuan/gridea-search
 */

(function() {
  var UPDATE_TIME = document.getElementById('gridea-search-result').getAttribute('data-update')

  fillSearchInput()
  grideaSearch()

  // 获取 url 参数
  function getParam(url, param) {
    if (url.indexOf('?') > -1) {
      var urlSearch = url.split('?')
      var paramList = urlSearch[1].split('&')
      for (var i = paramList.length - 1; i >= 0; i--) {
        var temp = paramList[i].split('=')
        if (temp[0] === param) {
          return temp[1]
        }
      }
    }
  }

  // 获取解码后的搜索词
  function getQueryPhrase() {
    var phrase = getParam(window.location.href, 'q') || ''
    var queryPhrase = decodeURIComponent(phrase.replace(/\+/g, ' '))
    return queryPhrase
  }

  // 填充搜索输入框
  function fillSearchInput() {
    var searchForm = document.getElementById('gridea-search-form')
    var searchInput = searchForm.getElementsByTagName('input')[0]
    searchInput.value = getQueryPhrase()
  }

  // 异步 GET 请求
  function get(obj) {
    var xhr = new XMLHttpRequest()
    xhr.open('get', obj.url, true)
    xhr.send(null)
    xhr.onreadystatechange = function() {
      // 异步请求：响应状态为4，数据加载完毕
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          obj.success(xhr.responseText)
        } else {
          obj.error(xhr.status)
        }
      }
    }
  }

  // 模糊搜索 https://github.com/krisk/fuse
  function fuzzySearch(data, phrase) {
    var options = {
      includeMatches: true,
      ignoreLocation: true,
      keys: [
        'title',
        'content'
      ]
    }
    // eslint-disable-next-line no-undef
    var fuse = new Fuse(data, options)
    var fuzzyResult = fuse.search(phrase)
    return fuzzyResult
  }

  // 显示无搜索结果
  function showNoResult() {
    var resultDIV = document.getElementById('gridea-search-result')
    var noResult = resultDIV.getElementsByClassName('no-result')[0]
    noResult.style.display = 'block'
    resultDIV.innerHTML = noResult.outerHTML
  }

  // 获取搜索结果列表模板的 URL
  function getTemplateURL() {
    var scripts = document.getElementsByTagName('script')
    var templateURL = ''
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].type === 'text/ejs') {
        templateURL = scripts[i].src
        return templateURL
      }
    }
  }

  // 渲染搜索结果列表 ejs https://github.com/mde/ejs
  function renderResult(searchedInfos) {
    if (searchedInfos.posts.length > 0) {
      get({
        url: getTemplateURL() + '?_=' + UPDATE_TIME,
        success: function(data) {
          var resultDIV = document.getElementById('gridea-search-result')
          // eslint-disable-next-line no-undef
          resultDIV.innerHTML = ejs.compile(data)(searchedInfos)
        }
      })
    } else {
      showNoResult()
    }
  }

  // 搜索结果关键字高亮
  function keywordHighlight(searchedContent) {
    var searchedPostContent = searchedContent.item.content// 搜索结果内容预览
    var preview = ''
    for (var i = 0; i < searchedContent.matches.length; i++) {
      if (searchedContent.matches[i].key === 'content') { // 如果匹配到文章内容，截取关键字
        var indices = searchedContent.matches[i].indices[0]
        var beforeKeyword = searchedPostContent.substring(indices[0] - 10, indices[0])// 关键字前10字
        var keyword = searchedPostContent.substring(indices[0], indices[1] + 1)// 关键字
        var afterKeyword = searchedPostContent.substring(indices[1] + 1, indices[1] + 70)// 关键字后70字
        preview = beforeKeyword + '<span class="searched-keyword">' +
                    keyword + '</span>' + afterKeyword
      } else { // 没有匹配到文章内容，则是标题，直接截取前80字
        preview = searchedPostContent.substring(0, 80)
      }
    }
    return preview + '...'
  }

  // 获取博客信息 api
  function getApi(callback) {
    get({
      url: '../api/index.html' + '?_=' + UPDATE_TIME,
      success: function(data) {
        callback(JSON.parse(data))
      }
    })
  }

  // 根据一段文本调用模糊搜索
  function searchBy(phrase, callback) {
    var result = ''
    // 根据全文内容获取搜索结果
    getApi(function(response) {
      result = fuzzySearch(response.posts, phrase)
      var mergedResult = mergeResult(response, result)
      callback(mergedResult)
    })
  }

  // 根据解码后的搜索词执行搜索
  function searchByPhrase(resultHandler) {
    var queryPhrase = getQueryPhrase()
    if (queryPhrase === '' || typeof (queryPhrase) === 'undefined') {
      showNoResult()
    } else {
      searchBy(queryPhrase, resultHandler)
    }
  }

  // 插入高亮预览结果
  function mergeResult(response, searchedResult) {
    var postsMap = {}
    for (var i = 0; i < response.posts.length; i++) {
      postsMap[response.posts[i].link] = response.posts[i]
    }

    response.posts = []
    for (var j = 0; j < searchedResult.length; j++) {
      var post = postsMap[searchedResult[j].item.link]
      post.searchedPreview = keywordHighlight(searchedResult[j])// 预览关键字高亮
      response.posts.push(post)
    }
    return response
  }

  // 主方法
  function grideaSearch() {
    // 搜索结果回调
    searchByPhrase(function(searchedContents) {
      renderResult(searchedContents)
    })
  }
})()
