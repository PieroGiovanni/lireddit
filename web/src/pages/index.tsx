import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables: variables });

  if (!fetching && !data) {
    return <div>your query failed for some reason</div>;
  }
  return (
    <Layout>
      <Flex align="center">
        <Heading>Li Reddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && !fetching ? (
        <div>...loading</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>{" "}
              <Text>posted by {p.creator.username}</Text>
              <Text mt={4}>{p.textSnippet + "..."}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore === true ? (
        <Flex>
          <Button
            isLoading={fetching}
            m="auto"
            my={8}
            colorScheme="purple"
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
