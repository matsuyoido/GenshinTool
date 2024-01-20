# GenshinTool


TODO: Score用の処理


https://github.com/Puton1221/GenshinDataJsonCreator

    → メインによって、計算式が変わる
      https://github.com/Puton1221/GenshinDataJsonCreator/blob/main/src/funcs/totalCal.ts#L10-L26
    → これ、、一度 enkaを使ってどういうデータが取得できるのか試さないと無理だな……。。
      -> https://enka-network-api.vercel.app/api/namespace/GOODUtils#statKeyMap
        上記で取得できるデータが何か分からん！！

https://trevelerdivine.github.io/index.html

-> https://github.com/Trevelerdivine/trevelerdivine.github.io


https://wiki.hoyolab.com/pc/genshin/aggregate/character?bbs_presentation_style=fullscreen&lang=ja-jp



https://reqbin.com/
  -> https://reqbin.com/cgim1sf8


1. Github Actions で、 hoyowiki からデータをもらう
  - jsonファイル化
  - https://qiita.com/thaim/items/3d1a4d09ec4a7d8844ce
  - https://zenn.dev/snowcait/articles/903d86d668fcb7
  - https://go.dev/play/p/nPoYCp_drQn
  - 取得用API
    - POST:  https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list
      - characters
        - menu_id = 2
      - artifacts
        - menu_id = 5
    - GET: https://sg-wiki-api-static.hoyolab.com/hoyowiki/genshin/wapi/entry_page?entry_page_id=4577
      - characterの詳細
        - data.page.modules[1].components[0].component_id == "ascension" 
1. そのファイルを読み込む形で、計算をする


```
POST /hoyowiki/genshin/wapi/get_entry_page_list HTTP/1.1
Host: sg-wiki-api.hoyolab.com
authority: sg-wiki-api.hoyolab.com
accept: application/json, text/plain, */*
accept-encoding: gzip, deflate, br
accept-language: ja
referer: https://wiki.hoyolab.com/
x-rpc-language: ja-jp
Content-Type: application/json
Content-Length: 70

{"filters":[],"menu_id":"2","page_num":3,"page_size":30,"use_es":true}
```




```
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$session.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
$session.Cookies.Add((New-Object System.Net.Cookie("_MHYUUID", "916f9b6d-2be8-45d7-80e5-cae39c0b239b", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("HYV_LOGIN_PLATFORM_OPTIONAL_AGREEMENT", "{%22content%22:[]}", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("HYV_LOGIN_PLATFORM_LOAD_TIMEOUT", "{}", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("HYV_LOGIN_PLATFORM_TRACKING_MAP", "{%22sourceValue%22:%22165%22}", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("DEVICEFP_SEED_ID", "69e91e39e8ec3262", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("DEVICEFP_SEED_TIME", "1705384360190", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("_gid", "GA1.2.295314895.1705384360", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("DEVICEFP", "38d7f0492b445", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("mi18nLang", "ja-jp", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("_ga_GEYW4HC0FV", "GS1.1.1705384358.1.1.1705384594.0.0.0", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("HYV_LOGIN_PLATFORM_LIFECYCLE_ID", "{%22value%22:%226507b370-e395-426e-8231-16abe163b0d0%22}", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("_ga", "GA1.1.2037822877.1705384358", "/", ".hoyolab.com")))
$session.Cookies.Add((New-Object System.Net.Cookie("_ga_PDXBNGQFCP", "GS1.1.1705384360.1.1.1705384595.0.0.0", "/", ".hoyolab.com")))
Invoke-WebRequest -UseBasicParsing -Uri "https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list" `
-Method "POST" `
-WebSession $session `
-Headers @{
"authority"="sg-wiki-api.hoyolab.com"
  "method"="POST"
  "path"="/hoyowiki/genshin/wapi/get_entry_page_list"
  "scheme"="https"
  "accept"="application/json, text/plain, */*"
  "accept-encoding"="gzip, deflate, br"
  "accept-language"="ja"
  "origin"="https://wiki.hoyolab.com"
  "referer"="https://wiki.hoyolab.com/"
  "sec-ch-ua"="`"Not_A Brand`";v=`"8`", `"Chromium`";v=`"120`", `"Google Chrome`";v=`"120`""
  "sec-ch-ua-mobile"="?0"
  "sec-ch-ua-platform"="`"Windows`""
  "sec-fetch-dest"="empty"
  "sec-fetch-mode"="cors"
  "sec-fetch-site"="same-site"
  "x-rpc-language"="ja-jp"
  "x-rpc-wiki_app"="genshin"
} `
-ContentType "application/json;charset=UTF-8" `
-Body "{`"filters`":[],`"menu_id`":`"2`",`"page_num`":3,`"page_size`":30,`"use_es`":true}"
```

```

Invoke-WebRequest -Uri "https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list" `
-Method "POST" `
-Headers @{
  "authority"="sg-wiki-api.hoyolab.com"
  "method"="POST"
  "path"="/hoyowiki/genshin/wapi/get_entry_page_list"
  "scheme"="https"
  "accept"="application/json, text/plain, */*"
  "accept-encoding"="gzip, deflate, br"
  "accept-language"="ja"
  "origin"="https://wiki.hoyolab.com"
  "referer"="https://wiki.hoyolab.com/"
  "sec-ch-ua"="`"Not_A Brand`";v=`"8`", `"Chromium`";v=`"120`", `"Google Chrome`";v=`"120`""
  "sec-ch-ua-mobile"="?0"
  "sec-ch-ua-platform"="`"Windows`""
  "sec-fetch-dest"="empty"
  "sec-fetch-mode"="cors"
  "sec-fetch-site"="same-site"
  "x-rpc-language"="ja-jp"
  "x-rpc-wiki_app"="genshin"
} `
-ContentType "application/json;charset=UTF-8" `
-Body "{`"filters`":[],`"menu_id`":`"2`",`"page_num`":3,`"page_size`":30,`"use_es`":true}"
```




fetch("https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "ja",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-language": "ja-jp",
    "x-rpc-wiki_app": "genshin",
    "cookie": "_MHYUUID=1904a9ff-ded3-492a-8d05-8d9b28b885e7; mi18nLang=ja-jp; HYV_LOGIN_PLATFORM_OPTIONAL_AGREEMENT={%22content%22:[]}; HYV_LOGIN_PLATFORM_LOAD_TIMEOUT={}; HYV_LOGIN_PLATFORM_TRACKING_MAP={%22sourceValue%22:%22165%22}; DEVICEFP_SEED_ID=9d4690f2f13b41a7; DEVICEFP_SEED_TIME=1705470351202; _gid=GA1.2.1748933505.1705470352; DEVICEFP=38d7f04b3b5f7; HYV_LOGIN_PLATFORM_LIFECYCLE_ID={%22value%22:%22577c3feb-8dce-4544-9dc7-5d522ba6a39e%22}; _ga_GEYW4HC0FV=GS1.1.1705470351.1.1.1705470382.0.0.0; _ga=GA1.1.1933574509.1705470351; _ga_PDXBNGQFCP=GS1.1.1705470351.1.1.1705470383.0.0.0",
    "Referer": "https://wiki.hoyolab.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"filters\":[],\"menu_id\":\"2\",\"page_num\":2,\"page_size\":30,\"use_es\":true}",
  "method": "POST"
});

```
fetch("https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "ja",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-language": "ja-jp",
    "x-rpc-wiki_app": "genshin",
    "Referer": "https://wiki.hoyolab.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"filters\":[],\"menu_id\":\"2\",\"page_num\":2,\"page_size\":30,\"use_es\":true}",
  "method": "POST"
});

```



fetch("https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "ja",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-language": "ja-jp",
    "x-rpc-wiki_app": "genshin"
  },
  "referrer": "https://wiki.hoyolab.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"filters\":[],\"menu_id\":\"2\",\"page_num\":2,\"page_size\":30,\"use_es\":true}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});









https://qiita.com/yaso28/items/fa0871d473bc5fc39dd7

