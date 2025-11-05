// import { queryOptions } from "@tanstack/react-query";
// import { PB } from "@/lib/authentication.ts";
// import {
//   FoodTypesRecord,
//   FoodTypesSubRecord,
//   MenuItemsRecord,
// } from "@/types/pb-types.ts";
// import { PBResponse } from "@/types/api.ts";
// import { C } from "@/types/db_collections.ts";
// import { MenuCategoryEnum } from "@/types/enums.ts";
//
// export const getAllergens = () =>
//   queryOptions({
//     queryKey: [C.ALLERGENS],
//     queryFn: async () => {
//       return await PB.collection(C.ALLERGENS).getFullList<
//         PBResponse<MenuItemsRecord>
//       >();
//     },
//     gcTime: Infinity,
//     retry: false,
//   });
//
// const MENU_CATEGORY_SORT: number[] = [
//   MenuCategoryEnum.C_FOOD_TYPE_PREDKRMY, // 2
//   MenuCategoryEnum.C_FOOD_TYPE_POLEVKY, // 4
//   MenuCategoryEnum.C_FOOD_TYPE_SALATY, // 9
//   MenuCategoryEnum.C_FOOD_TYPE_PIZZA, // 10
//   MenuCategoryEnum.C_FOOD_TYPE_TESTOVINY_RYZE, // 7
//   MenuCategoryEnum.C_FOOD_TYPE_BEZMASA_VEGETARIAN, // 8
//   MenuCategoryEnum.C_FOOD_TYPE_HLAVNI_CHODY, // 1
//   MenuCategoryEnum.C_FOOD_TYPE_MASO_STEJKY, // 11
//   MenuCategoryEnum.C_FOOD_TYPE_PRILOHY, // 6
//   MenuCategoryEnum.C_FOOD_TYPE_OMACKY, // 12
//   MenuCategoryEnum.C_FOOD_TYPE_DEZERTY, // 3
//   MenuCategoryEnum.C_FOOD_TYPE_NAPOJE, // 5
// ];
//
// export const getFoodTypes = () =>
//   queryOptions({
//     queryKey: [C.FOOD_TYPES],
//     queryFn: async () => {
//       const foodTypes = await PB.collection(C.FOOD_TYPES).getFullList<
//         PBResponse<FoodTypesRecord>
//       >();
//
//       // Řazení podle MENU_CATEGORY_SORT (pole ID)
//       return foodTypes.sort((a, b) => {
//         // Používáme a.id a b.id, která by měla být číselná
//         const idA = a.id;
//         const idB = b.id;
//
//         const indexA = MENU_CATEGORY_SORT.indexOf(Number(idA));
//         const indexB = MENU_CATEGORY_SORT.indexOf(Number(idB));
//
//         // Pokud jsou obě ID v poli pro řazení, řaď podle jejich pozice
//         if (indexA !== -1 && indexB !== -1) {
//           return indexA - indexB;
//         }
//
//         // Položky, které nejsou v poli pro řazení, jdou na konec
//         if (indexA === -1) return 1;
//         if (indexB === -1) return -1;
//
//         return 0;
//       });
//     },
//     gcTime: Infinity,
//     retry: false,
//   });
//
// export const getFoodSubTypes = () =>
//   queryOptions({
//     queryKey: [C.FOOD_TYPES_SUB],
//     queryFn: async () => {
//       return await PB.collection(C.FOOD_TYPES_SUB).getFullList<
//         PBResponse<FoodTypesSubRecord>
//       >();
//     },
//     gcTime: Infinity,
//     retry: false,
//   });
