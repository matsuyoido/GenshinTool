package infrastructure

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/matsuyoido/hoyowiki-data/domain/model"
)

type ArtifactListResponse struct {
	Data struct {
		Total string
		List  []struct {
			EntryPageId  string `json:"entry_page_id"`
			Name         string
			IconUrl      string `json:"icon_url"`
			DisplayField struct {
				GobletOfEonothemIconUrl string `json:"goblet_of_eonothem_icon_url"`
				PlumeOfDeathIconUrl     string `json:"plume_of_death_icon_url"`
				SandsOfEonIconUrl       string `json:"sands_of_eon_icon_url"`
				CircletOfLogosIconUrl   string `json:"circlet_of_logos_icon_url"`
				FlowerOfLifeIconUrl     string `json:"flower_of_life_icon_url"`
				TwoSetEffect            string `json:"two_set_effect"`
				FourSetEffect           string `json:"four_set_effect"`
			} `json:"display_field"`
			FilterValues struct {
				ReliquaryEffect struct {
					Values     []string
					ValueTypes []struct {
						Id    string `json:"id"`
						Value string
					}
				} `json:"reliquary_effect"`
			} `json:"filter_values"`
		}
	}
}

func (r *HoyoWikiRepository) GetArtifactList(ctx context.Context) []model.ArtifactList {
	const getSize int = 50
	artifacts := []model.ArtifactList{}

	pageNum := 1
	total := 0
	client := &http.Client{}
loop:
	func() {
		timeoutCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
		defer cancel()
		request := r.CreateArtifactListRequest(timeoutCtx, pageNum, getSize)
		r.setHeaders(request.Header)
		response, err := client.Do(request)
		if err != nil {
			panic(err) // TODO: Error Handling
		}
		defer response.Body.Close()

		var artifactsData ArtifactListResponse
		if err := json.NewDecoder(response.Body).Decode(&artifactsData); err != nil {
			panic(err) // TODO: Error Handling
		}

		// NOTE: Read Artifact Value
		for _, artifactData := range artifactsData.Data.List {
			artifacts = append(artifacts, model.ArtifactList{
				Id:                      artifactData.EntryPageId,
				Name:                    artifactData.Name,
				IconUrl:                 artifactData.IconUrl,
				FlowerOfLifeIconUrl:     artifactData.DisplayField.FlowerOfLifeIconUrl,
				SandsOfEonIconUrl:       artifactData.DisplayField.SandsOfEonIconUrl,
				PlumeOfDeathIconUrl:     artifactData.DisplayField.PlumeOfDeathIconUrl,
				CircletOfLogosIconUrl:   artifactData.DisplayField.CircletOfLogosIconUrl,
				GobletOfEonothemIconUrl: artifactData.DisplayField.GobletOfEonothemIconUrl,
				TwoSetEffect:            artifactData.DisplayField.TwoSetEffect,
				FourSetEffect:           artifactData.DisplayField.FourSetEffect,
			})

			// NOTE: check read more
			if total == 0 {
				total, _ = strconv.Atoi(artifactsData.Data.Total)
			}
			if getSize*pageNum < total {
				pageNum++
			} else {
				pageNum = -1
			}
		}
	}()
	if 0 < pageNum {
		goto loop
	}

	return artifacts
}
