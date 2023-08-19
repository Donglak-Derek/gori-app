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

export async function fetchGoriById(id: string) {
  connectToDB();

  try {
    // TODO: Populate Community
    const gori = await Gori.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Gori,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return gori;
  } catch (error: any) {
    throw new Error(`Error fetching gori: ${error.message}`);
  }
}

export async function addCommentToGori(
  goriId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Adding comment
    // Find the original gori by its ID
    const originalGori = await Gori.findById(goriId);

    if (!originalGori) {
      throw new Error("Gori not found");
    }

    // Creat a new gori with the comment text
    const commentGori = new Gori({
      text: commentText,
      author: userId,
      parentId: goriId,
    });

    // Save the new gori
    const savedCommentGori = await commentGori.save();

    // Update the original gori to include the new comment
    originalGori.children.push(savedCommentGori._id);

    // Save the original gori
    await originalGori.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to gori: ${error.message}`);
  }
}
