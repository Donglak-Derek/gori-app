"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Gori from "../models/gori.model";
import User from "../models/user.model";
import Community from "../models/community.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createGori({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdGori = await Gori.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { goris: createdGori._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { goris: createdGori._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create gori: ${error.message}`);
  }
}

export async function fetchGoris(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    // Calculate the number of goris to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the goris that have no parent (top-level goris) (a gori that is not a comment/reply).
    const gorisQuery = Gori.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "community",
        model: Community,
      })
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
    }); // Get total number of goris

    const goris = await gorisQuery.exec();

    const isNext = totalGorisCount > skipAmount + goris.length;

    return { goris, isNext };
  } catch (error: any) {
    console.log("Error fetchGoris:", error);
    throw new Error(`Failed to fetchGoris: ${error.message}`);
  }
}

async function fetchAllChildGoris(goriId: string): Promise<any[]> {
  const childGoris = await Gori.find({ parentId: goriId });

  const descendantGoris = [];
  for (const childGori of childGoris) {
    const descendants = await fetchAllChildGoris(childGori._id);
    descendantGoris.push(childGori, ...descendants);
  }

  return descendantGoris;
}

export async function deleteGori(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the gori to be deleted (the main gori)
    const mainGori = await Gori.findById(id).populate("author community");

    if (!mainGori) {
      throw new Error("Gori not found");
    }

    // Fetch all child goris and their descendants recursively
    const descendantGoris = await fetchAllChildGoris(id);

    // Get all descendant gori IDs including the main gori ID and child gori IDs
    const descendantGoriIds = [id, ...descendantGoris.map((gori) => gori._id)];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantGoris.map((gori) => gori.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainGori.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantGoris.map((gori) => gori.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainGori.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child goris and their descendants
    await Gori.deleteMany({ _id: { $in: descendantGoriIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { goris: { $in: descendantGoriIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { goris: { $in: descendantGoriIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete gori: ${error.message}`);
  }
}

export async function fetchGoriById(goriId: string) {
  connectToDB();
  try {
    // TODO: Populate Community
    const gori = await Gori.findById(goriId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
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
    console.log("Error fetchGoriById:", error);
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
    console.log("Error addCommentToGori:", error);
    throw new Error(`Error adding comment to gori: ${error.message}`);
  }
}
