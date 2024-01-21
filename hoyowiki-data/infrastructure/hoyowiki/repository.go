package infrastructure

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
)

type HoyoWikiRepository struct {
}

func (HoyoWikiRepository) setHeaders(header http.Header) http.Header {
	header.Add("Content-Type", "application/json")
	header.Add("authority", "sg-wiki-api.hoyolab.com")
	header.Add("accept", "application/json, text/plain, */*")
	header.Add("accept-language", "ja")
	header.Add("x-rpc-language", "ja-jp")
	header.Add("referer", "https://wiki.hoyolab.com/")
	return header
}

func (HoyoWikiRepository) CreateCharacterListRequest(ctx context.Context, page int, size int) *http.Request {
	body := []byte(fmt.Sprintf(`{"filters":[],"menu_id":"2","page_num":%d,"page_size":%d,"use_es":true}`, page, size))
	req, err := http.NewRequestWithContext(ctx, "POST", "https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list", bytes.NewBuffer(body))
	if err != nil {
		panic(err) // TODO: Error Handling
	}
	return req
}
func (HoyoWikiRepository) CreateCharacterOneRequest(ctx context.Context, entryPageId string) *http.Request {
	url := fmt.Sprintf("https://sg-wiki-api-static.hoyolab.com/hoyowiki/genshin/wapi/entry_page?entry_page_id=%s", entryPageId)
	req, err := http.NewRequestWithContext(ctx, "GET", url, http.NoBody)
	if err != nil {
		panic(err) // TODO: Error Handling
	}
	return req
}

func (HoyoWikiRepository) CreateArtifactListRequest(ctx context.Context, page int, size int) *http.Request {
	body := []byte(fmt.Sprintf(`{"filters":[],"menu_id":"5","page_num":%d,"page_size":%d,"use_es":true}`, page, size))
	req, err := http.NewRequestWithContext(ctx, "POST", "https://sg-wiki-api.hoyolab.com/hoyowiki/genshin/wapi/get_entry_page_list", bytes.NewBuffer(body))
	if err != nil {
		panic(err) // TODO: Error Handling
	}
	return req
}
