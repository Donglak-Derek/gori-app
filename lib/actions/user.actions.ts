"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import User from "../models/user.model";
import Gori from "../models/gori.model";

import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log("Error updateUser:", error);
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error: any) {
    console.log("Error fetchUser:", error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserGoris(userId: string) {
  try {
    connectToDB();

    // Find all goris authored by user with the given userId

    // TODO: Populate community
    const goris = await User.findOne({ id: userId }).populate({
      path: "goris",
      model: Gori,
      populate: {
        path: "children",
        model: Gori,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return goris;
  } catch (error: any) {
    console.error("Error fetchUserGoris:", error);
    throw new Error(`Failed to fetch user goris: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQurery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQurery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    console.error("Error fetchUsers:", error);
    throw new Error(`Failed to fetchUsers: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all goris created by this user
    const userGoris = await Gori.find({ author: userId });

    // Collect all the child goris ids (replies) from the "children" field
    // (collect all and put them into one array)
    const childGoriIds = userGoris.reduce((acc, userGori) => {
      return acc.concat(userGori.children);
    }, []);

    const replies = await Gori.find({
      _id: { $in: childGoriIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error: any) {
    console.error("Error fetching activity: ", error);
    throw new Error(`Failed to fetch activity: ${error.message}`);
  }
}
