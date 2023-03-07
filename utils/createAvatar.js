import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export const Avatar = async (seed) => {
  const avatar = createAvatar(initials, {
    seed,
  });
  // console.log(seed);
  // console.log(avatar.toDataUri());

  //   const svg = avatar.toString();
  //   return svg;
  return avatar.toDataUri();
};
