import {
  Routes,
  Route,
  Outlet,
  Link as ReactRouterLink,
} from "react-router-dom";
import ArtifactScore from "@page/artifact_score";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Link,
  Box,
  Button,
  HStack,
  Card,
  CardBody,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

const Layout = (): JSX.Element => (
  <>
    <Alert
      status="warning"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        原神の非公式サイト
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        利用する際は自己責任でお願いします。
      </AlertDescription>
    </Alert>
    <HStack pt={4} spacing={6} justifyContent="center">
      <Button variant="link">
        <Link as={ReactRouterLink} to="/">
          Home
        </Link>
      </Button>
      <Button variant="link">
        <Link as={ReactRouterLink} to="/artifact">
          聖遺物スコア計算
        </Link>
      </Button>
    </HStack>
    <Box p={4}>
      <Outlet />
    </Box>

    <Text mt="3rem" textAlign="center" fontSize="xs">
      本サイト内の画像およびデータは
      <Link
        href="https://wiki.hoyolab.com/pc/genshin/home?lang=ja-jp"
        isExternal
      >
        HoYoverse/COGNOSPHERE
      </Link>
      の著作物です。
      <br />
      Copyright © COGNOSPHERE. All Rights Reserved.
    </Text>
  </>
);

const Home = (): JSX.Element => (
  <>
    <Card>
      <CardBody>
        <Text>
          UID を入力しないで、原神のスコア計算をするためのサイトです。
        </Text>
        <Text>データの送信や収集は、一切行っておりません。</Text>
        <Text mt="2rem">各ページごとの詳細は、下記となります。</Text>
        <UnorderedList>
          <ListItem>
            聖遺物スコア計算:
            <UnorderedList listStyleType="none">
              <ListItem>
                https://github.com/matsuyoido/GenshinTool/blob/master/genshin-score/src/pages/artifact_score.tsx
              </ListItem>
              <ListItem>
                https://github.com/matsuyoido/GenshinTool/blob/master/genshin-score/src/modules/atrifact.ts
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </CardBody>
    </Card>
  </>
);

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="artifact" element={<ArtifactScore />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
