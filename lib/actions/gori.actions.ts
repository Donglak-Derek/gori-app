"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import { GoriValidation } from "../validations/gori";

import Gori from "../models/gori.model";
import User from "../models/user.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createGori({ text, author, communityId, path }: Params) {
  connectToDB();

  const createdGori = await Gori.create({
    text,
    author,
    community: null,
  });

  // Update user model
  await User.findByIdAndUpdate(author, {
    $push: { goris: createdGori._id },
  });

  revalidatePath(path);
}
