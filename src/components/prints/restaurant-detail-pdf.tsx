import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { PBResponse } from "@/types/api.ts";
import { RestaurantsRecord } from "@/types/pb-types";
import { imageUrl } from "@/lib/imageUrl.ts";
import { RestaurantHours, RestaurantWithHours } from "@/types/types.ts";
import { format, parseISO, isValid } from "date-fns";
import { cs } from "date-fns/locale";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: 40,
    backgroundColor: "#ffffff",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 8,
    objectFit: "cover",
  },
  titleWrap: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#75716b",
  },
  qrWrap: {
    alignItems: "center",
    gap: 4,
  },
  qrImage: {
    width: 96,
    height: 96,
    borderRadius: 6,
  },
  smallMuted: {
    fontSize: 8,
    color: "#75716b",
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  hoursGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  hoursRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hoursDay: {
    width: 120,
    fontWeight: 500,
  },
  hoursTime: {
    flex: 1,
    textAlign: "right",
  },
});

export type RestaurantDetailPDFProps = {
  restaurant: PBResponse<RestaurantWithHours>;
  appUrl: string;
  qrDataUrl?: string;
};

export default function RestaurantDetailPDF({
  restaurant,
  appUrl,
  qrDataUrl,
}: RestaurantDetailPDFProps) {
  const url = `${appUrl}/restaurace/${restaurant.slug}`;
  const hours = (restaurant.hours as unknown as RestaurantHours) || undefined;

  const days: Array<keyof NonNullable<RestaurantHours["opening_hours"]>> = [
    "Pondělí",
    "Úterý",
    "Středa",
    "Čtvrtek",
    "Pátek",
    "Sobota",
    "Neděle",
  ];

  return (
    <Document>
      <Page style={styles.page} size="A4">
        <View style={styles.header}>
          {restaurant.photo ? (
            <Image
              style={styles.logo}
              src={imageUrl({ record: restaurant, fileName: restaurant.photo })}
            />
          ) : null}
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{restaurant.name}</Text>
            <Text style={styles.subtitle}>{url}</Text>
          </View>
          {qrDataUrl ? (
            <View style={styles.qrWrap}>
              <Image src={qrDataUrl} style={styles.qrImage} />
              <Text style={styles.smallMuted}>
                Naskenujte pro veřejný profil
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresa</Text>
          {restaurant.adr_full ? (
            <Text style={styles.text}>{restaurant.adr_full}</Text>
          ) : (
            <Text style={styles.text}>{restaurant.address || "—"}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt</Text>
          <Text style={styles.text}>Email: {restaurant.email || "—"}</Text>
          <Text style={styles.text}>Telefon: {restaurant.phone || "—"}</Text>
        </View>

        {restaurant.important_message ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Důležité</Text>
            <Text style={styles.text}>{restaurant.important_message}</Text>
          </View>
        ) : null}

        {restaurant.desc ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popis</Text>
            <Text style={styles.text}>{restaurant.desc}</Text>
          </View>
        ) : null}

        {/* Opening Hours */}
        {hours?.opening_hours ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Otevírací doba</Text>
            <View style={styles.hoursGrid}>
              {days.map((day) => {
                const d = hours.opening_hours?.[day as string];
                const label = day as string;
                let time = "—";
                if (d) {
                  time = d.closed ? "Zavřeno" : `${d.open} – ${d.close}`;
                }
                return (
                  <View key={label} style={styles.hoursRow}>
                    <Text style={[styles.text, styles.hoursDay]}>{label}</Text>
                    <Text style={[styles.text, styles.hoursTime]}>{time}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Special Hours */}
        {hours?.special_hours && hours.special_hours.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mimořádná otevírací doba</Text>
            <View style={styles.hoursGrid}>
              {hours.special_hours.map((s, idx) => {
                const parsed = s.date ? parseISO(s.date) : null;
                const dateStr =
                  parsed && isValid(parsed)
                    ? format(parsed, "d. MMMM yyyy", { locale: cs })
                    : s.date || "";
                const time = s.closed
                  ? "Zavřeno"
                  : `${s.open || "?"} – ${s.close || "?"}`;
                return (
                  <View key={`${s.date}-${idx}`} style={styles.hoursRow}>
                    <Text style={[styles.text, styles.hoursDay]}>
                      {dateStr}
                    </Text>
                    <Text style={[styles.text, styles.hoursTime]}>{time}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
