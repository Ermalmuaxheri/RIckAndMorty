import { gql } from "@apollo/client";

export const GET_FILTERED_CHARACTERS = gql`
  query getFilteredCharacters($page: Int!, $status: String, $species: String) {
    characters(page: $page, filter: { status: $status, species: $species }) {
      info {
        next
      }
      results {
        id
        name
        status
        species
        gender
        origin {
          name
        }
        image
      }
    }
  }
`;
