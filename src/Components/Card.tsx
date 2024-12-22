import Image from "next/image";
import clsx from "clsx";
import DE from "@/lng/de";
import EN from "@/lng/en";

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

interface CardProps {
  character: Character;
  language: string;
}

const Card = ({ character, language }: CardProps) => {
  const statusColor =
    character.status === "Alive"
      ? "bg-[#a1e3c3]"
      : character.status === "Dead"
      ? "bg-[#f69898]"
      : "bg-[#afd3ec]";

  const statusColorText =
    character.status === "Alive"
      ? "text-[#597c69]"
      : character.status === "Dead"
      ? "text-[#6d4545]"
      : "text-[#52616c]";

  const translate = language === "EN" ? EN : DE;

  const translatedSpecies =
    character.species === "Human"
      ? translate.human
      : character.species === "Alien"
      ? translate.alien
      : character.species === "Mythological Creature"
      ? translate.myth
      : character.species === "Animal"
      ? translate.animal
      : character.species === "Robot"
      ? translate.robot
      : translate.unknown;

  return (
    <div className="border rounded-lg shadow-md grid sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 bg-white">
      <div className="flex bg-white rounded-lg overflow-hidden">
        <Image
          src={character.image}
          alt={character.name}
          layout="responsive"
          width={100}
          height={100}
          objectFit="cover"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="p-2">
        <h2 className="text-3xl font-semibold mt-2 text-TextPrimary">
          {character.name}
        </h2>
        <p
          className={clsx(
            "border rounded-lg w-fit p-1 text-2xl",
            statusColorText,
            statusColor
          )}
        >
          {character.status === "Alive"
            ? translate.alive
            : character.status === "Dead"
            ? translate.dead
            : translate.unknown}
        </p>
        <p className="text-xl">
          {translate.species}
          {": "} {translatedSpecies}
        </p>
        <p className="text-xl">
          {translate.gender}
          {": "}
          {character.gender === "Male"
            ? translate.male
            : character.gender === "Female"
            ? translate.female
            : translate.unknown}
        </p>
        <p className="text-xl">
          {translate.origin}
          {": "} {character.origin.name}
        </p>
      </div>
    </div>
  );
};

export default Card;
