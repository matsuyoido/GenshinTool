package service

import (
	"context"

	"github.com/matsuyoido/hoyowiki-data/domain/model"
)

type ArtifactRepository interface {
	GetArtifactList(ctx context.Context) []model.ArtifactList
}
