import { PB } from "@/lib/authentication.ts";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { MenuItemsRecord, MenusRecord } from "@/types/pb-types.ts";
import { PBResponse } from "@/types/api.ts";
import { useRouter } from "@tanstack/react-router";
import { C } from "@/types/db_collections.ts";

export const getMenusByType = ({
  type,
  restaurantId,
}: {
  type: number;
  restaurantId: string | undefined;
}) =>
  queryOptions({
    queryKey: [C.MENUS, type, restaurantId],
    queryFn: async () => {
      return await PB.collection(C.MENUS).getList<PBResponse<MenusRecord>>(
        1,
        3,
        {
          filter: `restaurant_id = "${restaurantId}" && type = "${type}"`,
          sort: "created",
        },
      );
    },
    enabled: !!restaurantId,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });

export const getMenuItems = ({
  menuId,
  restaurantId,
}: {
  menuId: string | undefined;
  restaurantId: string;
}) =>
  queryOptions({
    queryKey: [C.MENU_ITEMS, menuId, restaurantId],
    queryFn: async () => {
      return await PB.collection(C.MENU_ITEMS).getFullList<
        PBResponse<MenuItemsRecord>
      >({
        filter: `menu_id = "${menuId}"`,
        sort: "position",
      });
    },
    enabled: !!menuId,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });

export const useDeleteMenuItem = (menuId: string, restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      return await PB.collection(C.MENU_ITEMS).delete(itemId);
    },
    onSuccess: async (_, itemId) => {
      toast.success("Položka smazána", {
        description: "Položka byla úspěšně odstraněna.",
      });
      await queryClient.invalidateQueries({
        queryKey: [C.MENU_ITEMS, menuId, restaurantId],
      });
    },
    onError: async (error: {
      data?: { data?: Record<string, string>; status?: number };
      message?: string;
    }) => {
      const message =
        error.data?.status === 400
          ? "Neplatná data. Zkontrolujte prosím všechna pole."
          : error.message || "Něco se nepovedlo, zkuste to prosím znovu.";

      toast.error("Chyba při mazání", {
        description: message,
      });
    },
  });
};

export function useMenuMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMenu = useMutation({
    mutationFn: async (values: Omit<MenusRecord, "id">) => {
      console.log(values);
      const newMenu = {
        description: values.description || "",
        restaurant_id: values.restaurant_id,
        type: values.type,
        valid_from: values.valid_from || "",
        valid_until: values.valid_until || "",
      };

      // Check if restaurant already has 2 menus of this type
      const existingMenus = await PB.collection(C.MENUS).getList<
        PBResponse<MenusRecord>
      >(1, 3, {
        filter: `restaurant_id = "${values.restaurant_id}" && type = "${values.type}"`,
        sort: "created",
      });

      // If there are already 2 menus, use batch to delete the oldest one
      if (existingMenus.items.length >= 2) {
        const oldestMenu = existingMenus.items[0]; // First item is oldest due to sort
        await batchRemoveMenu(oldestMenu.id, newMenu);
      } else {
        return await PB.collection(C.MENUS).create<PBResponse<MenusRecord>>(
          newMenu,
        );
      }
    },
    onSuccess: async (res) => {
      toast.success("Menu bylo vytvořeno", {
        description: "Menu bylo úspěšně vytvořeno.",
      });
      await queryClient.invalidateQueries({
        queryKey: [C.MENUS],
      });
      router.invalidate();
    },
    onError: (error: any) => {
      const message =
        error.data?.status === 400
          ? "Neplatná data. Zkontrolujte prosím všechna pole."
          : "Něco se nepovedlo, zkuste to prosím znovu.";

      toast.error("Při vytváření menu se vyskytla chyba", {
        description: message,
      });
    },
  });

  const updateMenu = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Omit<MenusRecord, "id">;
    }) => {
      const data = {
        description: values.description || "",
        restaurant_id: values.restaurant_id,
        type: values.type,
        valid_from: values.valid_from || "",
        valid_until: values.valid_until || "",
      };

      return await PB.collection(C.MENUS).update<PBResponse<MenusRecord>>(
        id,
        data,
      );
    },
    onSuccess: async (res) => {
      toast.success("Menu bylo upraveno", {
        description: "Menu bylo úspěšně upraveno.",
      });
      await queryClient.invalidateQueries({
        queryKey: [C.MENUS],
      });
    },
    onError: (error: any) => {
      const message =
        error.data?.status === 400
          ? "Neplatná data. Zkontrolujte prosím všechna pole."
          : "Něco se nepovedlo, zkuste to prosím znovu.";

      toast.error("Při úpravě menu se vyskytla chyba", {
        description: message,
      });
    },
  });

  const deleteMenu = useMutation({
    mutationFn: async (id: string) => {
      await batchRemoveMenu(id);
    },
    onSuccess: async (_, id) => {
      toast.success("Menu bylo smazáno", {
        description: "Menu bylo úspěšně smazáno.",
      });
      await queryClient.invalidateQueries({
        queryKey: [C.MENUS],
      });
    },
    onError: (error: any) => {
      toast.error("Při mazání menu se vyskytla chyba", {
        description: "Něco se nepovedlo, zkuste to prosím znovu.",
      });
    },
  });

  const activateMenu = useMutation({
    mutationFn: async (values: {
      menuId: MenusRecord["id"];
      restaurantId: MenusRecord["restaurant_id"];
      type: MenusRecord["type"];
    }) => {
      const { menuId, restaurantId, type } = values;

      // fetch 2 latest menus of given type for the restaurant, oldest first
      const existingMenus = await PB.collection(C.MENUS).getList<
        PBResponse<MenusRecord>
      >(1, 3, {
        filter: `restaurant_id = "${restaurantId}" && type = "${type}"`,
        sort: "created",
      });

      // if there are 2 menus and the first (oldest) isn't the one to activate, remove it
      if (
        existingMenus.items.length >= 2 &&
        existingMenus.items[0].id !== menuId
      ) {
        await batchRemoveMenu(existingMenus.items[0].id);
      }

      // no structural changes needed to "activate" since active menu is inferred
      return true;
    },
    onSuccess: async () => {
      toast.success("Menu bylo zplatněno", {
        description: "Menu bylo úspěšně zplatněno.",
      });
      await queryClient.invalidateQueries({
        queryKey: [C.MENUS],
      });
      router.invalidate();
    },
    onError: () => {
      toast.error("Při aktivaci menu se vyskytla chyba", {
        description: "Něco se nepovedlo, zkuste to prosím znovu.",
      });
    },
  });

  return {
    createMenu,
    updateMenu,
    deleteMenu,
    activateMenu,
  };
}

const batchRemoveMenu = async (
  menuToRemoveId: string,
  newMenuData?: Omit<MenusRecord, "id">,
) => {
  // Get all menu items for the oldest menu

  const batch = PB.createBatch();

  // Delete the oldest menu
  batch.collection(C.MENUS).delete(menuToRemoveId);

  // Create the new menu
  if (newMenuData) {
    batch.collection(C.MENUS).create(newMenuData);
  }

  return await batch.send();
};
