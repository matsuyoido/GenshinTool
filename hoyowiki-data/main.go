package main

import (
	"context"
	"encoding/json"
	"os"

	"github.com/matsuyoido/hoyowiki-data/domain/service"
	infrastructure "github.com/matsuyoido/hoyowiki-data/infrastructure/hoyowiki"
)

func main() {
	var artifactRepository service.ArtifactRepository
	var characterRepository service.CharacterRepository
	artifactRepository = new(infrastructure.HoyoWikiRepository)
	characterRepository = new(infrastructure.HoyoWikiRepository)

	ctx := context.Background()
	artifactList := artifactRepository.GetArtifactList(ctx)
	characterList := characterRepository.GetCharacters(ctx)

	artifactDataFile, err := os.Create("artifacts.json")
	if err != nil {
		panic(err)
	}
	err = json.NewEncoder(artifactDataFile).Encode(artifactList)
	if err != nil {
		panic(err)
	}

	characterDataFile, err := os.Create("characters.json")
	if err != nil {
		panic(err)
	}
	err = json.NewEncoder(characterDataFile).Encode(characterList)
	if err != nil {
		panic(err)
	}
}
