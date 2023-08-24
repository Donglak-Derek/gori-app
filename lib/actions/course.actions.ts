/** to create new course from frontEnd */
import Course from "../models/course.model";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import Lesson from "../models/lesson.model";
import Classe from "../models/classe.model";
import Wordcard from "../models/wordcard.model";

export async function fetchCourses() {
  try {
    connectToDB();

    const coursesQuery = Course.find()
      .sort({ createdAt: "desc" })
      .populate({
        path: "lessons",
        model: Lesson,
        populate: {
          path: "classes",
          model: Classe,
        },
      });
    const allCourses = await coursesQuery.exec();

    return allCourses;
  } catch (error: any) {
    console.log("Error fetchCourses:", error);
    throw new Error(`Failed to fetchCourses: ${error.message}`);
  }
}

export async function fetchClasseById(ClasseId: string) {
  connectToDB();
  try {
    const classe = await Classe.findById(ClasseId)
      .populate({
        path: "wordcards",
        model: Wordcard,
      })
      .exec();

    return classe;
  } catch (error: any) {
    console.log("Error fetchClasseById:", error);
    throw new Error(`Error fetching classe: ${error.message}`);
  }
}
