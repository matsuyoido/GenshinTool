package infrastructure

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/matsuyoido/hoyowiki-data/domain/model"
)

type CharacterListResponse struct {
	Data struct {
		Total string
		List  []struct {
			EntryPageId  string `json:"entry_page_id"`
			Name         string
			IconUrl      string `json:"icon_url"`
			FilterValues struct {
				CharacterVision struct {
					Values []string
				} `json:"character_vision"`
				CharacterWeapon struct {
					Values []string
				} `json:"character_weapon"`
				CharacterRegion struct {
					Values []string
				} `json:"character_region"`
				CharacterRarity struct {
					Values []string
				} `json:"character_rarity"`
				CharacterProperty struct {
					Values []string
				} `json:"character_property"`
			} `json:"filter_values"`
		}
	}
}
type CharacterOneResponse struct {
	Data struct {
		Page struct {
			Name         string
			IconUrl      string `json:"icon_url"`
			HeaderImgUrl string `json:"header_img_url"`
			Modules      []struct {
				Name       string
				Components []struct {
					ComponentId string `json:"component_id"`
					Data        string
				}
			}
		}
	}
}
type ComponentAscensionData struct {
	List []struct {
		Key        string
		CombatList []struct {
			Key    string
			Values []string
		}
	}
}

func (r *HoyoWikiRepository) GetCharacters(ctx context.Context) []model.Character {
	const getSize int = 50
	characters := []model.Character{}

	pageNum := 1
	total := 0
	client := &http.Client{}
	var wg sync.WaitGroup
loop:
	func() {
		timeoutCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
		defer cancel()
		request := r.CreateCharacterListRequest(timeoutCtx, pageNum, getSize)
		r.setHeaders(request.Header)
		response, err := client.Do(request)
		if err != nil {
			panic(err) // TODO: Error Handling
		}
		defer response.Body.Close()

		var responseData CharacterListResponse
		if err := json.NewDecoder(response.Body).Decode(&responseData); err != nil {
			panic(err) // TODO: Error Handling
		}

		// NOTE: Read Character Value
		for _, characterData := range responseData.Data.List {
			if characterData.Name == "旅人" {
				continue // NOTE: 旅人は各元素ごとのデータを持つため、対象外
			}
			characters = append(characters, model.Character{
				Id:      characterData.EntryPageId,
				Name:    characterData.Name,
				IconUrl: characterData.IconUrl,
				Element: model.CharacterElement(characterData.FilterValues.CharacterVision.Values[0]),
			})
			wg.Add(1)
			go func(entryPageId string) {
				defer wg.Done()
				timeoutCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
				defer cancel()
				characterDetailGetRequest := r.CreateCharacterOneRequest(timeoutCtx, entryPageId)
				r.setHeaders(characterDetailGetRequest.Header)
				characterDetailGetResponse, err := client.Do(characterDetailGetRequest)
				if err != nil {
					panic(err) // TODO: Error Handling
				}
				defer characterDetailGetResponse.Body.Close()

				var characterDetailData CharacterOneResponse
				if err := json.NewDecoder(characterDetailGetResponse.Body).Decode(&characterDetailData); err != nil {
					panic(err) // TODO: Error Handling
				}

				index := -1
				var character model.Character
				for i, v := range characters {
					if v.Name == characterDetailData.Data.Page.Name {
						character = v
						index = i
						break
					}
				}

				character.ImageUrl = characterDetailData.Data.Page.HeaderImgUrl
				for _, module := range characterDetailData.Data.Page.Modules {
					if module.Name == "突破" {
						for _, v := range module.Components {
							if v.ComponentId == "ascension" {
								newJson := strings.ReplaceAll(strings.ReplaceAll(v.Data, `"$[`, ""), `]$"`, "")
								newJson = strings.ReplaceAll(strings.ReplaceAll(newJson, `\\`, ""), `\"`, `"`)
								var levelMaxStatus ComponentAscensionData
								if err := json.Unmarshal([]byte(newJson), &levelMaxStatus); err != nil {
									panic(err) // TODO: Error Handling
								}
								for _, v := range levelMaxStatus.List {
									if v.Key == "Lv.90" {
										for _, val := range v.CombatList {
											if val.Key == "" {
												continue
											}
											if val.Key == "基礎HP" {
												character.LvMaxHp = val.Values[0]
												continue
											}
											if val.Key == "基礎攻撃力" {
												character.LvMaxAttack = val.Values[0]
												continue
											}
											if val.Key == "基礎防御力" {
												character.LvMaxDeffence = val.Values[0]
												continue
											}
											character.LvMaxOptionLabel = val.Key
											character.LvMaxOptionValue = val.Values[0]
										}
									}
								}
								break
							}
						}
						break
					}
				}
				characters[index] = character
			}(characterData.EntryPageId)
		}

		// NOTE: check read more
		if total == 0 {
			total, _ = strconv.Atoi(responseData.Data.Total)
		}
		if getSize*pageNum < total {
			pageNum++
		} else {
			pageNum = -1
		}
	}()
	if 0 < pageNum {
		goto loop
	}
	wg.Wait()
	return characters
}
