// src/components/menu/MenuPDF.tsx
import React from "react";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type {
  FoodTypesRecord,
  FoodTypesSubRecord,
  MenuItemsRecord,
} from "@/types/pb-types";
import { imageUrl } from "@/lib/imageUrl.ts";
import { PBResponse } from "@/types/api.ts";
import { format, isSameDay, parseISO, isValid } from "date-fns";
import { cs } from "date-fns/locale";

// --- Font Registration: ONLY using available weights (300, 500, 700) ---
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300, // Light
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500, // Medium
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700, // Bold
    },
  ],
});

Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});

// --- Style Adjustments: Corrected Colors and Font Weights ---
const PRIMARY_COLOR = "#f97316";
const FOREGROUND_COLOR = "#1f1d1c";
const MUTE_FG_COLOR = "#75716b";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: 40,
    backgroundColor: "#ffffff",
    fontSize: 9,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 700, // Bold
    color: FOREGROUND_COLOR,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    color: MUTE_FG_COLOR,
  },
  section: {
    marginBottom: 24,
  },
  // Food Type Header
  sectionHeader: {
    fontSize: 16,
    fontWeight: 700, // Bold
    color: PRIMARY_COLOR,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  subSection: {
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: `${MUTE_FG_COLOR}`,
    paddingBottom: 12,
  },
  // SubType Header
  subSectionHeader: {
    fontSize: 12,
    fontWeight: 500, // Medium (was 600/semibold)
    color: `${FOREGROUND_COLOR}`,
    marginBottom: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: `${PRIMARY_COLOR}`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Menu Item
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 4,
    marginRight: 12,
    objectFit: "cover",
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
    flexWrap: "wrap",
    minWidth: 0,
  },
  itemNameAndBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
    flexWrap: "wrap",
    paddingRight: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: 500, // Medium (was 600/semibold)
    color: FOREGROUND_COLOR,
    lineHeight: 1.2,
  },
  badge: {
    fontSize: 10,
    flexShrink: 0,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 700, // Bold
    color: PRIMARY_COLOR,
    whiteSpace: "nowrap",
    flexShrink: 0,
    textAlign: "right",
  },
  // Description
  itemDesc: {
    fontSize: 10,
    color: MUTE_FG_COLOR,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  // Allergens
  itemAllergens: {
    fontSize: 8,
    color: `${MUTE_FG_COLOR}`,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: MUTE_FG_COLOR,
    borderTopWidth: 0.5,
    paddingTop: 8,
  },
});

type MenuPDFProps = {
  menuName: string;
  foodTypes: PBResponse<FoodTypesRecord>[];
  foodSubTypes: PBResponse<FoodTypesSubRecord>[];
  menuItems: PBResponse<MenuItemsRecord>[];
  validFrom: string | undefined;
  validTo: string | undefined;
};

export default function MenuPDF({
  menuName,
  foodTypes,
  foodSubTypes,
  menuItems,
  validFrom,
  validTo,
}: MenuPDFProps) {
  const grouped = foodTypes
    .map((type) => {
      const typeItems = menuItems.filter((item) => item.food_type === type.id);

      const usedSubTypeIds = [
        ...new Set(typeItems.map((item) => item.food_subtype).filter(Boolean)),
      ];

      const subTypeGroups = usedSubTypeIds
        .map((subTypeId) => {
          const subType = foodSubTypes.find((st) => st.id === subTypeId);
          if (!subType) return null;

          return {
            ...subType,
            items: typeItems.filter((item) => item.food_subtype === subTypeId),
          };
        })
        .filter(
          (group): group is NonNullable<typeof group> =>
            group !== null && group.items.length > 0,
        );

      const itemsWithoutSubType = typeItems.filter(
        (item) => !item.food_subtype,
      );

      return {
        ...type,
        subTypeGroups,
        itemsWithoutSubType,
        hasItems: typeItems.length > 0,
      };
    })
    .filter((group) => group.hasItems);

  // Emojis for icons
  const renderHotness = (level?: number) => {
    if (!level || level < 1) return null;
    const clampedLevel = Math.min(Math.floor(level), 3);
    return "🌶️".repeat(clampedLevel);
  };
  const renderSpecialty = () => "🌟";

  // Date formatting logic
  let dateDisplay = "";
  const dateFormat = "d. MMMM yyyy";

  if (validFrom) {
    const fromDate = parseISO(validFrom);
    if (isValid(fromDate)) {
      dateDisplay = format(fromDate, dateFormat, { locale: cs });

      if (validTo) {
        const toDate = parseISO(validTo);
        if (isValid(toDate) && !isSameDay(fromDate, toDate)) {
          dateDisplay += ` - ${format(toDate, dateFormat, { locale: cs })}`;
        }
      }
    }
  }

  const renderItem = (
    item: PBResponse<MenuItemsRecord>,
    isLastInSection: boolean,
  ) => (
    <View
      key={item.id}
      style={[styles.item, isLastInSection ? styles.lastItem : {}]}
      wrap={false}
    >
      {/* Image - Small Thumbnail */}
      {item.image && (
        <Image
          src={imageUrl({
            record: item,
            fileName: item.image,
          })}
          style={styles.image}
        />
      )}

      {/* Item Content */}
      <View style={styles.itemContent}>
        {/* Name and Badges + Price */}
        <View style={styles.nameRow}>
          {/* Name and Badges */}
          <View style={styles.itemNameAndBadges}>
            <Text style={styles.itemName}>{item.name}</Text>

            {/* Specialty Badge (Star) */}
            {item.special && (
              <Text style={styles.badge}>{renderSpecialty()}</Text>
            )}

            {/* Hotness (Flame) */}
            {item.hot && item.hot > 0 && (
              <Text style={styles.badge}>{renderHotness(item.hot)}</Text>
            )}
          </View>

          {/* Price */}
          {item.price != null && (
            <Text style={styles.itemPrice}>{item.price.toFixed(0)} Kč</Text>
          )}
        </View>

        {/* Description */}
        {item.desc && <Text style={styles.itemDesc}>{item.desc}</Text>}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <Text style={styles.itemAllergens}>
            Alergeny: {item.allergens.join(", ")}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Document>
      <Page style={styles.page} size="A4">
        {/* Header */}
        <View style={styles.header} wrap={false}>
          <Text style={styles.title}>{menuName}</Text>
          <Text style={styles.subtitle}>
            Jídelní lístek{dateDisplay ? ` • ${dateDisplay}` : ""}
          </Text>
        </View>

        {/* Menu Content (Flows continuously) */}
        <View style={{ flexGrow: 1 }}>
          {grouped.map((foodType, foodTypeIndex) => {
            const isLastFoodType = foodTypeIndex === grouped.length - 1;

            return (
              <View key={foodType.id} style={[styles.section]} wrap={false}>
                {/* Food Type Header */}
                <Text style={styles.sectionHeader}>{foodType.name}</Text>

                {/* Items without sub-type first */}
                {foodType.itemsWithoutSubType.length > 0 &&
                  foodType.itemsWithoutSubType.map((item, index) =>
                    renderItem(
                      item,
                      index === foodType.itemsWithoutSubType.length - 1 &&
                        foodType.subTypeGroups.length === 0,
                    ),
                  )}

                {/* Sub-type groups */}
                {foodType.subTypeGroups.map((subGroup, subIndex) => {
                  const isLastSubGroup =
                    subIndex === foodType.subTypeGroups.length - 1;
                  return (
                    <View key={subGroup.id} style={styles.subSection}>
                      {/* SubType Header */}
                      <Text style={styles.subSectionHeader}>
                        {subGroup.name}
                      </Text>

                      {/* Menu Items */}
                      {subGroup.items.map((item, itemIndex) =>
                        renderItem(
                          item,
                          itemIndex === subGroup.items.length - 1 &&
                            isLastSubGroup &&
                            isLastFoodType,
                        ),
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <Text style={styles.footer} fixed>
          {/*Všechny ceny jsou uvedeny v CZK včetně DPH*/}
        </Text>
      </Page>
    </Document>
  );
}
