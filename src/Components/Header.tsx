import Image from "next/image";
import { logoImage } from "../../public/images/image";

export default function Header() {
  return (
    <>
      <div className="flex justify-center h-fit ">
        <Image src={logoImage} alt="oh no " className="size-fit h-[200px]" />
      </div>
    </>
  );
}
