import { HStack } from "@chakra-ui/react";
import Image from "next/image";

import Link from "next/link";
import logo from "../../../public/logo-light.png";

interface LogoProps {
  width: number;
  color?: string;
}

export const Logo = (props: LogoProps) => {
  return (
    <Link href={""} passHref legacyBehavior>
      <HStack spacing={2} mr={4} as={"a"}>
        <Image
          src={logo}
          width={props.width}
          alt={"We Are Super Meals App"}
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </HStack>
    </Link>
  );
};
