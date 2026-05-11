"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  priceMatrix: {
    small?: number;
    medium?: number;
    large?: number;
    extraLarge?: number;
    motorcycleStandard?: number;
    motorcycleMoge?: number;
    motorcycleExtraLarge?: number;
  };
  duration: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo?: string;
}

interface ContactInfo {
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  hours: string;
  facebook: string;
  instagram: string;
}

interface QueueItem {
  id: string;
  queueNumber: string;
  customerName: string;
  phoneNumber: string;
  vehicleType: "car" | "motorcycle";
  vehiclePlate: string;
  serviceId: string;
  serviceName: string;
  price: number;
  status: "waiting" | "in-progress" | "completed" | "cancelled";
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
  paid?: boolean; // client-side flag to indicate payment recorded
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: Date;
  queueId?: string;
}

interface AuditLog {
  id: string;
  actorId?: string;
  action: "create" | "update" | "delete";
  tableName: string;
  recordId?: string;
  changes?: Record<string, any>;
  createdAt: Date;
}

interface ContentContextType {
  services: Service[];
  setServices: (services: Service[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[]) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  queueItems: QueueItem[];
  setQueueItems: (items: QueueItem[]) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  auditLogs: AuditLog[];
  isLoading: boolean;
}

type ServicePriceKey = keyof Service["priceMatrix"];

const PRICE_KEYS: ServicePriceKey[] = [
  "small",
  "medium",
  "large",
  "extraLarge",
  "motorcycleStandard",
  "motorcycleMoge",
  "motorcycleExtraLarge",
];

const defaultContactInfo: ContactInfo = {
  address: "",
  phone1: "",
  phone2: "",
  email1: "",
  email2: "",
  hours: "",
  facebook: "",
  instagram: "",
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

function normalizeStatus(status: string): QueueItem["status"] {
  if (status === "in_progress") return "in-progress";
  if (status === "done") return "completed";
  if (status === "canceled") return "cancelled";
  if (status === "in-progress" || status === "completed" || status === "cancelled") return status;
  return "waiting";
}

function inferServiceCategory(priceMatrix: Service["priceMatrix"]): "car" | "bike" | "both" {
  const hasCar = Boolean(
    priceMatrix.small ?? priceMatrix.medium ?? priceMatrix.large ?? priceMatrix.extraLarge,
  );
  const hasBike = Boolean(
    priceMatrix.motorcycleStandard ?? priceMatrix.motorcycleMoge ?? priceMatrix.motorcycleExtraLarge,
  );

  if (hasCar && hasBike) return "both";
  if (hasBike) return "bike";
  return "car";
}

function priceMatrixToRows(serviceId: string, matrix: Service["priceMatrix"]) {
  return PRICE_KEYS.filter((key) => matrix[key] !== undefined).map((key) => ({
    id: crypto.randomUUID(),
    service_id: serviceId,
    size_key: key,
    amount: Number(matrix[key] ?? 0),
  }));
}

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const [services, setServicesState] = useState<Service[]>([]);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>([]);
  const [galleryImages, setGalleryImagesState] = useState<GalleryImage[]>([]);
  const [teamMembers, setTeamMembersState] = useState<TeamMember[]>([]);
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(defaultContactInfo);
  const [queueItems, setQueueItemsState] = useState<QueueItem[]>([]);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      const supabase = createClient();

      const [
        servicesRes,
        testimonialsRes,
        galleryRes,
        teamRes,
        contactRes,
        queuesRes,
        transactionsRes,
        auditLogsRes,
      ] = await Promise.all([
        supabase
          .from("services")
          .select(
            "id, name, title, description, features, duration_label, duration_minutes, service_prices (size_key, amount)",
          )
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("testimonials")
          .select("id, name, text, rating")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("gallery_images")
          .select("id, image_url, title, category")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("team_members")
          .select("id, name, role, description, photo_url")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("contact_info")
          .select("address, phone1, phone2, email1, email2, hours, facebook, instagram")
          .eq("id", true)
          .maybeSingle(),
        supabase
          .from("queues")
          .select(
            "id, queue_number, customer_name, phone_number, vehicle_type, vehicle_plate, service_id, service_name, price, status, queued_at, completed_at, notes",
          )
          .order("queued_at", { ascending: false }),
        supabase
          .from("transactions")
          .select("id, type, category, amount, description, transaction_at, queue_id")
          .order("transaction_at", { ascending: false }),
        supabase
          .from("audit_logs")
          .select("id, actor_id, action, table_name, record_id, changes, created_at")
          .order("created_at", { ascending: false }),
      ]);

      if (!mounted) {
        return;
      }

      if (servicesRes.error) console.error("Failed to load services", servicesRes.error.message);
      if (testimonialsRes.error) console.error("Failed to load testimonials", testimonialsRes.error.message);
      if (galleryRes.error) console.error("Failed to load gallery", galleryRes.error.message);
      if (teamRes.error) console.error("Failed to load team", teamRes.error.message);
      if (contactRes.error) console.error("Failed to load contact", contactRes.error.message);
      if (queuesRes.error) console.error("Failed to load queues", queuesRes.error.message);
      if (transactionsRes.error) console.error("Failed to load transactions", transactionsRes.error.message);
      if (auditLogsRes.error) console.error("Failed to load audit logs", auditLogsRes.error.message);

      const mappedServices: Service[] = (servicesRes.data ?? []).map((service) => {
        const priceMatrix: Service["priceMatrix"] = {};
        const rows = Array.isArray(service.service_prices)
          ? (service.service_prices as Array<{ size_key: ServicePriceKey; amount: number }> )
          : [];

        rows.forEach((row) => {
          priceMatrix[row.size_key] = Number(row.amount);
        });

        return {
          id: service.id,
          icon: "Briefcase",
          title: service.title || service.name || "Untitled Service",
          description: service.description ?? "",
          features: Array.isArray(service.features) ? service.features : [],
          priceMatrix,
          duration:
            service.duration_label ||
            (service.duration_minutes && service.duration_minutes > 0
              ? `${service.duration_minutes} minutes`
              : "0 minutes"),
        };
      });

      const mappedTestimonials: Testimonial[] = (testimonialsRes.data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        text: row.text,
        rating: Number(row.rating),
      }));

      const mappedGallery: GalleryImage[] = (galleryRes.data ?? []).map((row) => ({
        id: row.id,
        url: row.image_url,
        title: row.title,
        category: row.category ?? "Service",
      }));

      const mappedTeam: TeamMember[] = (teamRes.data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        description: row.description,
        photo: row.photo_url ?? undefined,
      }));

      const mappedQueues: QueueItem[] = (queuesRes.data ?? []).map((row) => ({
        id: row.id,
        queueNumber: row.queue_number,
        customerName: row.customer_name,
        phoneNumber: row.phone_number ?? "",
        vehicleType: row.vehicle_type === "motorcycle" ? "motorcycle" : "car",
        vehiclePlate: row.vehicle_plate,
        serviceId: row.service_id ?? "",
        serviceName: row.service_name ?? "",
        price: Number(row.price ?? 0),
        status: normalizeStatus(row.status),
        createdAt: new Date(row.queued_at),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        notes: row.notes ?? "",
        // paid is a client-only flag; DB doesn't track it
        paid: false,
      }));

      const mappedTransactions: Transaction[] = (transactionsRes.data ?? []).map((row) => ({
        id: row.id,
        type: row.type as Transaction["type"],
        category: row.category,
        amount: Number(row.amount),
        description: row.description,
        date: new Date(row.transaction_at),
        queueId: row.queue_id ?? undefined,
      }));

      const mappedAuditLogs: AuditLog[] = (auditLogsRes.data ?? []).map((row) => ({
        id: row.id,
        actorId: row.actor_id ?? undefined,
        action: row.action,
        tableName: row.table_name,
        recordId: row.record_id ?? undefined,
        changes: row.changes,
        createdAt: new Date(row.created_at),
      }));

      setServicesState(mappedServices);
      setTestimonialsState(mappedTestimonials);
      setGalleryImagesState(mappedGallery);
      setTeamMembersState(mappedTeam);
      setContactInfoState(contactRes.data ?? defaultContactInfo);
      setQueueItemsState(mappedQueues);
      setTransactionsState(mappedTransactions);
      setAuditLogsState(mappedAuditLogs);
      setIsLoading(false);
    };

    void loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  const setServices = (next: Service[]) => {
    const previous = services;
    setServicesState(next);

    void (async () => {
      const supabase = createClient();

      const upsertRows = next.map((service, index) => {
        const prices = PRICE_KEYS.map((key) => service.priceMatrix[key]).filter(
          (amount): amount is number => amount !== undefined,
        );
        const fallbackPrice = prices.length > 0 ? Math.min(...prices) : 0;

        return {
          id: service.id,
          name: service.title,
          title: service.title,
          category: inferServiceCategory(service.priceMatrix),
          description: service.description,
          features: service.features,
          price: fallbackPrice,
          duration_minutes: parseDurationMinutes(service.duration),
          duration_label: service.duration,
          is_active: true,
          sort_order: index,
        };
      });

      if (upsertRows.length > 0) {
        const { error } = await supabase.from("services").upsert(upsertRows, { onConflict: "id" });
        if (error) console.error("Failed to upsert services", error.message);
      }

      for (const service of next) {
        const { error: deletePriceError } = await supabase
          .from("service_prices")
          .delete()
          .eq("service_id", service.id);

        if (deletePriceError) {
          console.error("Failed to clear service prices", deletePriceError.message);
          continue;
        }

        const priceRows = priceMatrixToRows(service.id, service.priceMatrix);
        if (priceRows.length > 0) {
          const { error: insertPriceError } = await supabase
            .from("service_prices")
            .insert(priceRows);

          if (insertPriceError) {
            console.error("Failed to save service prices", insertPriceError.message);
          }
        }
      }

      const removedIds = previous
        .map((item) => item.id)
        .filter((id) => !next.some((item) => item.id === id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from("services").delete().in("id", removedIds);
        if (error) console.error("Failed to delete services", error.message);
      }
    })();
  };

  const setTestimonials = (next: Testimonial[]) => {
    const previous = testimonials;
    setTestimonialsState(next);

    void (async () => {
      const supabase = createClient();

      if (next.length > 0) {
        const rows = next.map((item, index) => ({
          id: item.id,
          name: item.name,
          text: item.text,
          rating: item.rating,
          sort_order: index,
          is_visible: true,
        }));

        const { error } = await supabase.from("testimonials").upsert(rows, { onConflict: "id" });
        if (error) console.error("Failed to upsert testimonials", error.message);
      }

      const removedIds = previous
        .map((item) => item.id)
        .filter((id) => !next.some((item) => item.id === id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from("testimonials").delete().in("id", removedIds);
        if (error) console.error("Failed to delete testimonials", error.message);
      }
    })();
  };

  const setGalleryImages = (next: GalleryImage[]) => {
    const previous = galleryImages;
    setGalleryImagesState(next);

    void (async () => {
      const supabase = createClient();

      if (next.length > 0) {
        const rows = next.map((item, index) => ({
          id: item.id,
          image_url: item.url,
          title: item.title,
          category: item.category,
          sort_order: index,
          is_visible: true,
        }));

        const { error } = await supabase.from("gallery_images").upsert(rows, { onConflict: "id" });
        if (error) console.error("Failed to upsert gallery", error.message);
      }

      const removedIds = previous
        .map((item) => item.id)
        .filter((id) => !next.some((item) => item.id === id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from("gallery_images").delete().in("id", removedIds);
        if (error) console.error("Failed to delete gallery images", error.message);
      }
    })();
  };

  const setTeamMembers = (next: TeamMember[]) => {
    const previous = teamMembers;
    setTeamMembersState(next);

    void (async () => {
      const supabase = createClient();

      if (next.length > 0) {
        const rows = next.map((item, index) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          description: item.description,
          photo_url: item.photo ?? null,
          sort_order: index,
          is_active: true,
        }));

        const { error } = await supabase.from("team_members").upsert(rows, { onConflict: "id" });
        if (error) console.error("Failed to upsert team members", error.message);
      }

      const removedIds = previous
        .map((item) => item.id)
        .filter((id) => !next.some((item) => item.id === id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from("team_members").delete().in("id", removedIds);
        if (error) console.error("Failed to delete team members", error.message);
      }
    })();
  };

  const setContactInfo = (next: ContactInfo) => {
    setContactInfoState(next);

    void (async () => {
      const supabase = createClient();
      const { error } = await supabase.from("contact_info").upsert(
        {
          id: true,
          address: next.address,
          phone1: next.phone1,
          phone2: next.phone2 || null,
          email1: next.email1,
          email2: next.email2 || null,
          hours: next.hours,
          facebook: next.facebook || null,
          instagram: next.instagram || null,
        },
        { onConflict: "id" },
      );

      if (error) console.error("Failed to save contact info", error.message);
    })();
  };

  const setQueueItems = (next: QueueItem[]) => {
    const previous = queueItems;
    setQueueItemsState(next);

    void (async () => {
      const supabase = createClient();

      if (next.length > 0) {
        const rows = next.map((item) => ({
          id: item.id,
          queue_number: item.queueNumber,
          customer_name: item.customerName,
          phone_number: item.phoneNumber || null,
          vehicle_type: item.vehicleType,
          vehicle_plate: item.vehiclePlate,
          service_id: item.serviceId || null,
          service_name: item.serviceName || null,
          price: item.price,
          status: item.status,
          queued_at: item.createdAt.toISOString(),
          completed_at: item.completedAt ? item.completedAt.toISOString() : null,
          notes: item.notes || null,
        }));

        const { error } = await supabase.from("queues").upsert(rows, { onConflict: "id" });
        if (error) console.error("Failed to upsert queues", error.message);
      }

      const removedIds = previous
        .map((item) => item.id)
        .filter((id) => !next.some((item) => item.id === id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from("queues").delete().in("id", removedIds);
        if (error) console.error("Failed to delete queues", error.message);
      }
    })();
  };

  const setTransactions = (next: Transaction[]) => {
    const previous = transactions;
    setTransactionsState(next);

    void (async () => {
      const supabase = createClient();

      if (next.length > 0) {
        const rows = next.map((item) => ({
          id: item.id,
          type: item.type,
          category: item.category,
          amount: item.amount,
          description: item.description,
          transaction_at: item.date.toISOString(),
          queue_id: item.queueId || null,
        }));

        const { error } = await supabase.from("transactions").upsert(rows, { onConflict: "id" });
        if (error) console.error("Failed to upsert transactions", error.message);
      }

      const removedIds = previous
        .map((item) => item.id)
        .filter((id) => !next.some((item) => item.id === id));

      if (removedIds.length > 0) {
        const { error } = await supabase.from("transactions").delete().in("id", removedIds);
        if (error) console.error("Failed to delete transactions", error.message);
      }
    })();
  };

  const value = useMemo<ContentContextType>(
    () => ({
      services,
      setServices,
      testimonials,
      setTestimonials,
      galleryImages,
      setGalleryImages,
      teamMembers,
      setTeamMembers,
      contactInfo,
      setContactInfo,
      queueItems,
      setQueueItems,
      transactions,
      setTransactions,
      auditLogs,
      isLoading,
    }),
    [
      services,
      testimonials,
      galleryImages,
      teamMembers,
      contactInfo,
      queueItems,
      transactions,
      auditLogs,
      isLoading,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
