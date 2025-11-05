import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Heslo musí mít alespoň 8 znaků." })
  .regex(/[A-Z]/, {
    message: "Heslo musí obsahovat alespoň jedno velké písmeno.",
  })
  .regex(/[a-z]/, {
    message: "Heslo musí obsahovat alespoň jedno malé písmeno.",
  })
  .regex(/[0-9]/, {
    message: "Heslo musí obsahovat alespoň jedno číslo.",
  });
