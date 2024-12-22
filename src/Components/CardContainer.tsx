"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_FILTERED_CHARACTERS } from "@/Graphql/FilteredQuery";
import Card from "./Card";
import Image from "next/image";
import { loadingGif } from "../../public/images/image";
import EN from "@/lng/en";
import DE from "@/lng/de";

interface Origin {
  name: string;
}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: Origin;
  image: string;
}

interface Info {
  next: number | null;
}

interface CharactersData {
  characters: {
    info: Info;
    results: Character[];
  };
}

interface CharactersVars {
  page: number;
  status?: string;
  species?: string;
}

const CardContainer = () => {
  const [language, setLanguage] = useState<string>("EN");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [species, setSpecies] = useState<string | undefined>("Human");
  const [isFetching, setIsFetching] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { loading, error, data, fetchMore } = useQuery<
    CharactersData,
    CharactersVars
  >(GET_FILTERED_CHARACTERS, {
    variables: { page, status, species },
    onCompleted: (newData) => {
      if (newData?.characters?.results) {
        setCharacters((prev) => {
          const uniqueCharacters = newData.characters.results.filter(
            (newChar) =>
              !prev.some((existingChar) => existingChar.id === newChar.id)
          );
          return [...prev, ...uniqueCharacters];
        });
      }
    },
  });

  const translate = language === "EN" ? EN : DE;

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const loadMoreCharacters = useCallback(() => {
    if (isFetching || !data?.characters?.info?.next) return;

    setIsFetching(true);
    fetchMore({
      variables: { page: page + 1, status, species },
    })
      .then(({ data: newData }) => {
        if (newData?.characters?.results) {
          setCharacters((prev) => {
            const uniqueCharacters = newData.characters.results.filter(
              (newChar) =>
                !prev.some((existingChar) => existingChar.id === newChar.id)
            );
            return [...prev, ...uniqueCharacters];
          });
          setPage((prevPage) => prevPage + 1);
        }
      })
      .catch((err) => console.error("Error fetching more characters:", err))
      .finally(() => setIsFetching(false));
  }, [fetchMore, isFetching, data, page, status, species]);

  const handleScroll = useCallback(() => {
    if (!infiniteScroll || loading || isFetching) return;

    const scrollPos = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollPos + 100 >= docHeight) {
      loadMoreCharacters();
    }
  }, [infiniteScroll, loading, isFetching, loadMoreCharacters]);

  useEffect(() => {
    if (infiniteScroll) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, infiniteScroll]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value || undefined);
    setPage(1);
    setCharacters([]);
    toggleDropdown();
  };

  const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecies(event.target.value || undefined);
    setPage(1);
    setCharacters([]);
    toggleDropdown();
  };

  if (loading && characters.length === 0)
    return (
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-white">{translate.loading}...</h1>
        <Image src={loadingGif} alt="loading" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 border-b">
      <div className="flex justify-between">
        <h1 className="text-[40px] border-b font-bold text-white mb-4">
          Rick and Morty {translate.characters}
        </h1>
        <select
          name="setLanguage"
          id="languageSelect"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded bg-blue-400 text-white w-fit h-fit"
        >
          <option value="EN">En</option>
          <option value="DE">De</option>
        </select>
      </div>

      <div className="mb-4">
        <div className="flex items-center mt-4">
          <label className="text-white mr-2">{translate.enableScroll}</label>
          <input
            type="checkbox"
            checked={infiniteScroll}
            onChange={(e) => setInfiniteScroll(e.target.checked)}
            className="form-checkbox h-5 w-5 text-teal-500"
          />
        </div>
      </div>

      <div className=" my-4">
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {translate.filter}
        </button>
      </div>

      {isDropdownOpen && (
        <div className="p-5 my-2 border rounded-lg shadow-lg flex gap-[45px] text-white">
          <div className="ml-5 ">
            <h2>{translate.filterByStatus}</h2>
            <select
              className="p-2 border rounded bg-blue-400  mt-2"
              value={status || ""}
              onChange={handleStatusChange}
            >
              <option value="">{translate.all}</option>
              <option value="Alive">{translate.alive}</option>
              <option value="Dead">{translate.dead}</option>
              <option value="unknown">{translate.unknown}</option>
            </select>
          </div>
          <div>
            <h2>{translate.filterBySpecies}</h2>
            <select
              className="p-2  border rounded bg-blue-400  mt-2"
              value={species || ""}
              onChange={handleSpeciesChange}
            >
              <option value="Human">{translate.human}</option>
              <option value="Alien">{translate.alien}</option>
              <option value="Mythological Creature">{translate.myth}</option>
              <option value="Animal">{translate.animal}</option>
              <option value="Robot">{translate.robot}</option>
              <option value="">{translate.allSpecies}</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 shadow-sm">
        {characters.map((character) => (
          <Card key={character.id} character={character} language={language} />
        ))}
      </div>

      {!infiniteScroll && data?.characters?.info?.next && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadMoreCharacters}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none"
          >
            {translate.load}
          </button>
        </div>
      )}

      {isFetching && <div className="text-white">{translate.loading}</div>}
    </div>
  );
};

export default CardContainer;
