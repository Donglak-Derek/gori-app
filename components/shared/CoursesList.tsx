import { fetchCourses } from "@/lib/actions/course.actions";
import Link from "next/link";

export default async function CoursesList() {
  const result = await fetchCourses();

  return (
    <>
      <h1 className="text-heading1-bold font-semibold mb-10 text-left text-white">
        Courses (Login to track your course)
      </h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.length === 0 ? (
          <p className="text-lg text-gray-400">No Courses found</p>
        ) : (
          <>
            <div className="text-white space-y-8">
              {result.map((course: any) => (
                <div
                  key={course.id}
                  className="border rounded-md p-4 shadow-lg"
                >
                  <h2 className="text-heading2-semibold">{course.title}</h2>
                  <h2 className="text-heading4-medium text-gray-300 mb-4">
                    {course.description}
                  </h2>

                  <div className="space-y-4">
                    {course.lessons.map((lesson: any, idx: number) => (
                      <div key={idx}>
                        <div className="text-xl font-medium text-heading3-bold">
                          {idx + 1}. {lesson.lessonTitle}
                        </div>
                        <div className="grid grid-cols-1 mt-4">
                          {lesson.classes.map((classe: any, index: number) => (
                            <div key={index} className="text-light-3xl w-full">
                              <Link href={`/course/${classe._id}`}>
                                <p className="block border w-full rounded-md p-2 hover:bg-white hover:text-black">
                                  {classe.classeTitle}
                                </p>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
