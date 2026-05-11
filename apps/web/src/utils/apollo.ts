import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  // Using relative or absolute URL. Absolute is safer for SSR contexts if needed.
  uri: (typeof window !== "undefined" && import.meta.env.VITE_GRAPHQL_ENDPOINT) || "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_operation: any, { headers }: any) => {
  return {
    headers: {
      ...headers,
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          myCapsules: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
