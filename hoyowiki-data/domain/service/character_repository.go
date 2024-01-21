package service

import (
	"context"

	"github.com/matsuyoido/hoyowiki-data/domain/model"
)

type CharacterRepository interface {
	GetCharacters(ctx context.Context) []model.Character
}
