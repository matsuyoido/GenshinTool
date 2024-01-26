import { useState, useEffect } from "react";
import {
  Select,
  useChakraSelectProps,
  chakraComponents,
} from "chakra-react-select";
import {
  Image,
  Icon,
  Button,
  Box,
  Text,
  Hide,
  Heading,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  StackDivider,
  Radio,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SmallCloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import {
  artifacts,
  ArtifactData,
  ArtifactGrade,
  ArtifactCategory,
  ArtifactStatusCategory,
  calculateScore,
} from "@modules/atrifact";

function ArtifactScore(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [artifact, setArtifact] = useState<ArtifactData | undefined>(undefined);

  const [artifactCategory, setArtifactCategory] = useState<ArtifactCategory>(
    ArtifactCategory.Flower,
  );
  const [artifactMainOption, setArtifactMainOption] =
    useState<ArtifactStatusCategory>(
      ArtifactCategory.getMainOption(artifactCategory)[0],
    );
  const [hp, setHp] = useState<number>(0); // HP
  const [hpPercent, setHpPercent] = useState<string>(""); // HP(%)
  const [attack, setAttack] = useState<number>(0); // 攻撃力
  const [attackPercent, setAttackPercent] = useState<string>(""); // 攻撃力(%)
  const [defense, setDefense] = useState<number>(0); // 防御力
  const [defensePercent, setDefensePercent] = useState<string>(""); // 防御力(%)
  const [energyRecharge, setEnergyRecharge] = useState<string>(""); // 元素チャージ効率
  const [elementMastery, setElementMastery] = useState<number>(0); // 元素熟知
  const [critRate, setCritRate] = useState<string>(""); // 会心率
  const [critDMGBonus, setCritDMGBonus] = useState<string>(""); // 会心ダメージ

  const [isPreviewable, setIsPreviewable] = useState<boolean>(false);
  useEffect(() => {
    if (!artifact) {
      setIsPreviewable(false);
      return;
    }
    let setCount = 0;
    if (0 < hp) {
      setCount++;
    }
    if (hpPercent !== "" && hpPercent !== "0") {
      setCount++;
    }
    if (0 < attack) {
      setCount++;
    }
    if (attackPercent !== "" && attackPercent !== "0") {
      setCount++;
    }
    if (0 < defense) {
      setCount++;
    }
    if (defensePercent !== "" && defensePercent !== "0") {
      setCount++;
    }
    if (energyRecharge !== "" && energyRecharge !== "0") {
      setCount++;
    }
    if (0 < elementMastery) {
      setCount++;
    }
    if (critRate !== "" && critRate !== "0") {
      setCount++;
    }
    if (critDMGBonus !== "" && critDMGBonus !== "0") {
      setCount++;
    }
    setIsPreviewable(setCount === 4);
  });
  const inputRabelWidth = "8rem";
  const sectionPadding = "1rem";
  const labelMarginBottom = "0.5rem";
  const artifactSelectOptions = useChakraSelectProps({
    useBasicStyles: true,
    name: "atrifacts",
    options: artifacts.map((artifact: ArtifactData) => {
      return {
        value: artifact,
        label: artifact.name,
        icon: (
          <Image boxSize="50px" objectFit="cover" src={artifact.icon_url} />
        ),
      };
    }),
    components: {
      Option: ({ children, ...props }) => (
        <chakraComponents.Option {...props}>
          {props.data.icon} {children}
        </chakraComponents.Option>
      ),
    },
    placeholder: "聖遺物を選択してください",
    onChange(newValue) {
      setArtifact(newValue?.value);
    },
  });
  return (
    <>
      <Heading as="h1">聖遺物スコア計算</Heading>
      <Heading as="h3" size="md" mt={sectionPadding} mb={labelMarginBottom}>
        セット
      </Heading>
      <Select {...artifactSelectOptions} />
      <FormControl as="fieldset" mt={sectionPadding}>
        <FormLabel as="legend">
          <Heading as="h3" size="md">
            種類
          </Heading>
        </FormLabel>
        <RadioGroup
          onChange={(val) => {
            const artifactCategory = val as ArtifactCategory;
            setArtifactCategory(artifactCategory);
            const mainOption = ArtifactCategory.getMainOption(artifactCategory);
            if (mainOption.length === 1) {
              setArtifactMainOption(mainOption[0]);
            } else if (
              artifactMainOption &&
              !mainOption.includes(artifactMainOption)
            ) {
              setArtifactMainOption(mainOption[0]);
            }
          }}
          value={artifactCategory}
        >
          <Stack direction="row">
            {ArtifactCategory.All.map((category) => (
              <Radio key={category} value={category}>
                {category}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
      <FormControl mt={sectionPadding}>
        <FormLabel>
          <Heading as="h3" size="md">
            メインオプション
          </Heading>
        </FormLabel>
        <Select
          onChange={(newValue) =>
            setArtifactMainOption(
              newValue ? newValue.value : artifactMainOption,
            )
          }
          value={{ label: artifactMainOption, value: artifactMainOption }}
          options={ArtifactCategory.getMainOption(artifactCategory).map(
            (cat) => {
              return {
                label: cat,
                value: cat,
              };
            },
          )}
        />
      </FormControl>
      <Heading as="h3" size="md" mt={sectionPadding} mb={labelMarginBottom}>
        サブオプション
      </Heading>
      <Stack divider={<StackDivider borderColor="gray.200" />} align="stretch">
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            会心率
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(newVal) => setCritRate(newVal)}
            value={critRate}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon>%</InputRightAddon>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setCritRate("")}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            会心ダメージ
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(newVal) => setCritDMGBonus(newVal)}
            value={critDMGBonus}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon>%</InputRightAddon>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setCritDMGBonus("")}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            元素チャージ効率
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(newVal) => setEnergyRecharge(newVal)}
            value={energyRecharge}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon>%</InputRightAddon>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setEnergyRecharge("")}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            攻撃力(%)
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(newVal) => setAttackPercent(newVal)}
            value={attackPercent}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon>%</InputRightAddon>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setAttackPercent("")}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            攻撃力
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(_, newVal) =>
              setAttack(!Number.isNaN(newVal) ? newVal : 0)
            }
            value={attack === 0 ? "" : attack}
          >
            <NumberInputField />
          </NumberInput>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setAttack(0)}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            HP(%)
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(newVal) => setHpPercent(newVal)}
            value={hpPercent}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon>%</InputRightAddon>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setHpPercent("")}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            HP
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(_, newVal) => setHp(!Number.isNaN(newVal) ? newVal : 0)}
            value={hp === 0 ? "" : hp}
          >
            <NumberInputField />
          </NumberInput>
          <Button colorScheme="red" variant="outline" onClick={() => setHp(0)}>
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            防御力(%)
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(newVal) => setDefensePercent(newVal)}
            value={defensePercent}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon>%</InputRightAddon>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setDefensePercent("")}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            防御力
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(_, newVal) =>
              setDefense(!Number.isNaN(newVal) ? newVal : 0)
            }
            value={defense === 0 ? "" : defense}
          >
            <NumberInputField />
          </NumberInput>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setDefense(0)}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none" width={inputRabelWidth}>
            元素熟知
          </InputLeftElement>
          <NumberInput
            w="100%"
            pl={inputRabelWidth}
            onChange={(_, newVal) =>
              setElementMastery(!Number.isNaN(newVal) ? newVal : 0)
            }
            value={elementMastery === 0 ? "" : elementMastery}
          >
            <NumberInputField />
          </NumberInput>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => setElementMastery(0)}
          >
            <Icon as={SmallCloseIcon} />
          </Button>
        </InputGroup>
      </Stack>

      <Box textAlign="center" mt={sectionPadding}>
        <Button
          variant="outline"
          isDisabled={!isPreviewable}
          onClick={() => {
            onOpen();
          }}
        >
          結果を表示
        </Button>
      </Box>
      <Modal onClose={onClose} size="full" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>
            <HStack mt="1rem" mb="2rem">
              <Button variant="outline" onClick={onClose}>
                <ArrowBackIcon />
              </Button>
              <ModalCloseButton />
            </HStack>
            <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                <Tab _selected={{ bg: "orange.400" }} borderBottom="inset">
                  <Image
                    boxSize="2rem"
                    src="https://github.com/FuroBath/ArtifacterImageGen/blob/master/emotes/%E6%94%BB%E6%92%83%E5%8A%9B.png?raw=true"
                  />
                </Tab>
                <Tab _selected={{ bg: "orange.400" }} borderBottom="inset">
                  <Image
                    boxSize="2rem"
                    src="https://github.com/FuroBath/ArtifacterImageGen/blob/master/emotes/%E5%85%83%E7%B4%A0%E3%83%81%E3%83%A3%E3%83%BC%E3%82%B8%E5%8A%B9%E7%8E%87.png?raw=true"
                  />
                </Tab>
                <Tab _selected={{ bg: "orange.400" }} borderBottom="inset">
                  <Image
                    boxSize="2rem"
                    src="https://github.com/FuroBath/ArtifacterImageGen/blob/master/emotes/%E9%98%B2%E5%BE%A1%E5%8A%9B.png?raw=true"
                  />
                </Tab>
                <Tab _selected={{ bg: "orange.400" }} borderBottom="inset">
                  <Image
                    boxSize="2rem"
                    src="https://github.com/FuroBath/ArtifacterImageGen/blob/master/emotes/HP.png?raw=true"
                  />
                </Tab>
                <Tab _selected={{ bg: "orange.400" }} borderBottom="inset">
                  <Image
                    boxSize="2rem"
                    src="https://github.com/FuroBath/ArtifacterImageGen/blob/master/emotes/%E5%85%83%E7%B4%A0%E7%86%9F%E7%9F%A5.png?raw=true"
                  />
                </Tab>
              </TabList>
              {/* https://github.com/FuroBath/ArtifacterImageGen/tree/master/artifactGrades */}
              <TabPanels>
                <TabPanel pt={0} pb={0}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box textAlign="center">
                      <Heading as="h4" size="sm">
                        汎用型
                      </Heading>
                      <Text fontSize="4xl">
                        {calculateScore(
                          "汎用型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        )}
                      </Text>
                      <Text fontSize=".5rem">
                        = 攻撃力(%) + （会心率 * 2） + 会心ダメージ
                      </Text>
                    </Box>
                    <Image
                      ml="2rem"
                      boxSize="5rem"
                      src={`https://github.com/FuroBath/ArtifacterImageGen/blob/master/artifactGrades/${ArtifactGrade.judgeArtifactGrade(
                        artifactCategory,
                        calculateScore(
                          "汎用型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        ),
                      )}.png?raw=true`}
                    />
                  </Stack>
                </TabPanel>
                <TabPanel pt={0} pb={0}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box textAlign="center">
                      <Heading as="h4" size="sm">
                        元素チャージ型
                      </Heading>
                      <Text fontSize="4xl">
                        {calculateScore(
                          "元素チャージ型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        )}
                      </Text>
                      <Text fontSize=".5rem">
                        = （元素チャージ効率 * 0.4）
                        <Hide above="md">
                          <br />
                          　　
                        </Hide>{" "}
                        + （会心率 * 2） + 会心ダメージ
                      </Text>
                    </Box>
                    <Image
                      ml="2rem"
                      boxSize="5rem"
                      src={`https://github.com/FuroBath/ArtifacterImageGen/blob/master/artifactGrades/${ArtifactGrade.judgeArtifactGrade(
                        artifactCategory,
                        calculateScore(
                          "元素チャージ型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        ),
                      )}.png?raw=true`}
                    />
                  </Stack>
                </TabPanel>
                <TabPanel pt={0} pb={0}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box textAlign="center">
                      <Heading as="h4" size="sm">
                        防御型
                      </Heading>
                      <Text fontSize="4xl">
                        {calculateScore(
                          "防御型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        )}
                      </Text>
                      <Text fontSize=".5rem">
                        = 防御力(%) + （会心率 * 2） + 会心ダメージ
                      </Text>
                    </Box>
                    <Image
                      ml="2rem"
                      boxSize="5rem"
                      src={`https://github.com/FuroBath/ArtifacterImageGen/blob/master/artifactGrades/${ArtifactGrade.judgeArtifactGrade(
                        artifactCategory,
                        calculateScore(
                          "防御型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        ),
                      )}.png?raw=true`}
                    />
                  </Stack>
                </TabPanel>
                <TabPanel pt={0} pb={0}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box textAlign="center">
                      <Heading as="h4" size="sm">
                        HP型
                      </Heading>
                      <Text fontSize="4xl">
                        {calculateScore(
                          "HP型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        )}
                      </Text>
                      <Text fontSize=".5rem">
                        = HP(%) + （会心率 * 2） + 会心ダメージ
                      </Text>
                    </Box>
                    <Image
                      ml="2rem"
                      boxSize="5rem"
                      src={`https://github.com/FuroBath/ArtifacterImageGen/blob/master/artifactGrades/${ArtifactGrade.judgeArtifactGrade(
                        artifactCategory,
                        calculateScore(
                          "HP型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        ),
                      )}.png?raw=true`}
                    />
                  </Stack>
                </TabPanel>
                <TabPanel pt={0} pb={0}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box textAlign="center">
                      <Heading as="h4" size="sm">
                        熟知型
                      </Heading>
                      <Text fontSize="4xl">
                        {calculateScore(
                          "熟知型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        )}
                      </Text>
                      <Text fontSize=".5rem">
                        = （元素熟知 * 0.5） + 会心率 + （会心ダメージ * 0.5）
                      </Text>
                    </Box>
                    <Image
                      ml="2rem"
                      boxSize="5rem"
                      src={`https://github.com/FuroBath/ArtifacterImageGen/blob/master/artifactGrades/${ArtifactGrade.judgeArtifactGrade(
                        artifactCategory,
                        calculateScore(
                          "熟知型",
                          hp,
                          Number(hpPercent),
                          attack,
                          Number(attackPercent),
                          defense,
                          Number(defensePercent),
                          Number(energyRecharge),
                          elementMastery,
                          Number(critRate),
                          Number(critDMGBonus),
                        ),
                      )}.png?raw=true`}
                    />
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalHeader>
          <ModalBody>
            <Image
              src={
                artifactCategory === "生の花"
                  ? artifact?.flower_of_life_icon_url
                  : artifactCategory === "死の羽"
                    ? artifact?.plume_of_death_icon_url
                    : artifactCategory === "時の砂"
                      ? artifact?.sands_of_eon_icon_url
                      : artifactCategory === "空の杯"
                        ? artifact?.goblet_of_eonothem_icon_url
                        : artifactCategory === "理の冠"
                          ? artifact?.circlet_of_logos_icon_url
                          : artifact?.icon_url
              }
              mr="auto"
              ml="auto"
            />
            <Stack spacing="3" textAlign="center">
              <Heading as="h4">{artifact?.name}</Heading>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xl">{artifactMainOption}</Text>
                <Text fontSize="4xl">
                  {ArtifactStatusCategory.MainOptionValue(artifactMainOption)}
                </Text>
              </Stack>
              <StatGroup>
                {critRate !== "" && (
                  <Stat minW="50%">
                    <StatLabel>会心率</StatLabel>
                    <StatNumber>{critRate}%</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("会心率")}%
                    </StatHelpText>
                  </Stat>
                )}
                {critDMGBonus !== "" && (
                  <Stat minW="50%">
                    <StatLabel>会心ダメージ</StatLabel>
                    <StatNumber>{critDMGBonus}%</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("会心ダメージ")}
                      %
                    </StatHelpText>
                  </Stat>
                )}
                {attackPercent !== "" && (
                  <Stat minW="50%">
                    <StatLabel>攻撃力(%)</StatLabel>
                    <StatNumber>{attackPercent}%</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("攻撃力(%)")}%
                    </StatHelpText>
                  </Stat>
                )}
                {energyRecharge !== "" && (
                  <Stat minW="50%">
                    <StatLabel>元素チャージ効率</StatLabel>
                    <StatNumber>{energyRecharge}%</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue(
                        "元素チャージ効率",
                      )}
                      %
                    </StatHelpText>
                  </Stat>
                )}
                {elementMastery !== 0 && (
                  <Stat minW="50%">
                    <StatLabel>元素熟知</StatLabel>
                    <StatNumber>{elementMastery}</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("元素熟知")}
                    </StatHelpText>
                  </Stat>
                )}
                {hpPercent !== "" && (
                  <Stat minW="50%">
                    <StatLabel>HP(%)</StatLabel>
                    <StatNumber>{hpPercent}%</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("HP(%)")}%
                    </StatHelpText>
                  </Stat>
                )}
                {defensePercent !== "" && (
                  <Stat minW="50%">
                    <StatLabel>防御力(%)</StatLabel>
                    <StatNumber>{defensePercent}%</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("防御力(%)")}%
                    </StatHelpText>
                  </Stat>
                )}
                {attack !== 0 && (
                  <Stat minW="50%">
                    <StatLabel>攻撃力</StatLabel>
                    <StatNumber>{attack}</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("攻撃力")}
                    </StatHelpText>
                  </Stat>
                )}
                {hp !== 0 && (
                  <Stat minW="50%">
                    <StatLabel>HP</StatLabel>
                    <StatNumber>{hp}</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("HP")}
                    </StatHelpText>
                  </Stat>
                )}
                {defense !== 0 && (
                  <Stat minW="50%">
                    <StatLabel>防御力</StatLabel>
                    <StatNumber>{defense}</StatNumber>
                    <StatHelpText>
                      理論上最大値:{" "}
                      {ArtifactStatusCategory.SubOptionMaxValue("防御力")}
                    </StatHelpText>
                  </Stat>
                )}
              </StatGroup>
            </Stack>
          </ModalBody>
          <ModalFooter paddingY="5rem" />
        </ModalContent>
      </Modal>
    </>
  );
}

export default ArtifactScore;
