package model

type ArtifactCategory string

const (
	ArtifactFlower  ArtifactCategory = "生の花"
	ArtifactSand    ArtifactCategory = "時の砂"
	ArtifactPlume   ArtifactCategory = "死の羽"
	ArtifactCirclet ArtifactCategory = "理の冠"
	ArtifactGoblet  ArtifactCategory = "空の杯"
)

type Artifact struct {
	Name     string
	Category ArtifactCategory
	IconUrl  string
	ImageUrl string
}

type ArtifactList struct {
	Name string `json:"name"`

	FlowerOfLifeIconUrl     string `json:"flower_of_life_icon_url"`
	SandsOfEonIconUrl       string `json:"sands_of_eon_icon_url"`
	PlumeOfDeathIconUrl     string `json:"plume_of_death_icon_url"`
	CircletOfLogosIconUrl   string `json:"circlet_of_logos_icon_url"`
	GobletOfEonothemIconUrl string `json:"goblet_of_eonothem_icon_url"`

	TwoSetEffect  string `json:"two_set_effect"`
	FourSetEffect string `json:"four_set_effect"`
}
