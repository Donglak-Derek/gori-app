import { fetchCourses } from "@/lib/actions/course.actions";
import Link from "next/link";

export default async function CoursesList() {
  const result = await fetchCourses();

  return (
    <>
      <h1 className="head-text text-left">Courses</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.length === 0 ? (
          <p className="no-result">No Courese found</p>
        ) : (
          <>
            <div className="text-white">
              {result.map((course: any) => (
                <div key={course.id}>
                  <h2 className="head-text">{course.title}</h2>
                  <h2 className="text-light-3xl">{course.description}</h2>

                  <div>
                    {course.lessons.map((lesson: any, idx: number) => (
                      <div>
                        {idx + 1}. {lesson.lessonTitle}
                        <div>
                          {lesson.classes.map((classe: any, index: number) => (
                            <div key={index} className="text-light-3xl">
                              <Link href={`/course/${classe._id}`}>
                                <p>{classe.classeTitle}</p>
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
