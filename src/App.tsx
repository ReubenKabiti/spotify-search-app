import {
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { search } from "./api/api";
import { Link } from "react-router-dom";

const useDebounce = (value: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

function SearchBar({
  onQueryChanged,
  onClick,
}: {
  onQueryChanged: (query: string) => void;
  onClick: () => void;
}) {
  return (
    <InputGroup gap={2}>
      <Input
        placeholder="Enter your search query"
        onChange={(e) => onQueryChanged(e.target.value)}
      />
      <Button onClick={onClick}>Search</Button>
    </InputGroup>
  );
}

function App() {
  const [query, setQuery] = useState<string>("");

  const onQueryChanged = (query: string) => {
    setQuery(query);
  };

  const onSearchClick = () => {};

  const debouncedQuery = useDebounce(query, 500); // 500ms debounce

  const { data: searchResults } = useQuery({
    queryKey: ["get-tracks", debouncedQuery],
    queryFn: () => search(debouncedQuery),
    enabled: !!debouncedQuery, // Prevent unnecessary requests
  });

  return (
    <Stack p={4}>
      <Heading textAlign={"center"}>Search!</Heading>
      <SearchBar onClick={onSearchClick} onQueryChanged={onQueryChanged} />
      <Text fontWeight={"bold"}>
        Search Results: {searchResults?.total ?? 0}
      </Text>
      <Stack>
        {searchResults?.tracks.map((track) => (
          <Card
            cursor={"pointer"}
            onClick={() => console.log(track.external_urls.spotify)}
          >
            <CardBody>
              <Stack>
                <Text fontWeight={"bold"}>{track.name}</Text>
                <Flex gap={2}>
                  {track.artists.map((artist) => (
                    <Tag key={artist.id}>{artist.name}</Tag>
                  ))}
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

export default App;
