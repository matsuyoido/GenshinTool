package model

type CharacterElement string

const (
	ElementPyro    CharacterElement = "炎元素"
	ElementHydro   CharacterElement = "水元素"
	ElementDendro  CharacterElement = "草元素"
	ElementElectro CharacterElement = "雷元素"
	ElementAnemo   CharacterElement = "風元素"
	ElementCryo    CharacterElement = "氷元素"
	ElementGeo     CharacterElement = "岩元素"
)

type Character struct {
	Name     string           `json:"name"`
	Element  CharacterElement `json:"element"`
	IconUrl  string           `json:"icon_url"`
	ImageUrl string           `json:"image_url"`

	LvMaxHp          string `json:"lv_max_hp"`
	LvMaxAttack      string `json:"lv_max_attack"`
	LvMaxDeffence    string `json:"lv_max_deffence"`
	LvMaxOptionLabel string `json:"lv_max_option_label"`
	LvMaxOptionValue string `json:"lv_max_option_value"`
}
