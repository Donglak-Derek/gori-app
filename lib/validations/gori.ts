import * as z from "zod";

export const GoriValidation = z.object({
  gori: z
    .string()
    .nonempty()
    .min(3, { message: "Minimun 3 characters required" })
    .max(1000, { message: "Maximun 1000 characters" }),
  accountId: z.string(),
});

// export const CommentValidation = z.object({
//   gori: z
//     .string()
//     .nonempty()
//     .min(3, { message: "Minimun 3 characters required" })
//     .max(1000, { message: "Maximun 1000 characters" }),
// });
