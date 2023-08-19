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

export async function fetchGoris(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of goris to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the goris that have no parents (top-level goris....)
  const gorisQuery = Gori.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalGorisCount = await Gori.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const goris = await gorisQuery.exec();

  const isNext = totalGorisCount > skipAmount + goris.length;

  return { goris, isNext };
}
