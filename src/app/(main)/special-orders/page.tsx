"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChefHat,
  Gift,
  Heart,
  Star,
  CheckCircle,
  Upload,
  X,
  Camera,
  Clock,
  CreditCard,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";

// --- Types ---
interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  orderType: string;
  servingSize: string;
  flavors: string;
  decorations: string;
  budget: string;
  allergies: string;
  description: string;
}

// --- Sub-components ---

function StepHeader({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-[#e8e0d5]">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2c1a0e] text-[#f5ede3] text-xs font-bold tracking-widest font-mono shrink-0">
        {String(number).padStart(2, "0")}
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#1a0f07] tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#8a7060] mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  required,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-[#4a3728]"
      >
        <span>
          {label}
          {required && <span className="text-[#c0392b] ml-1">*</span>}
        </span>
        {hint}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "h-12 rounded-none border-0 border-b border-[#d0c5b8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2c1a0e] placeholder:text-[#bfb0a0] text-[#1a0f07] text-sm transition-colors duration-200 px-0";

export default function CustomOrderPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("custom-cakes");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    orderType: "",
    servingSize: "",
    flavors: "",
    decorations: "",
    budget: "",
    allergies: "",
    description: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast({
        title: "File too large",
        description: "Some files were skipped — limit is 5MB per file.",
        variant: "destructive",
      });
    }
    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDate) {
      toast({
        title: "Date Required",
        description: "Please select a needed-by date for your order.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: "Request Received",
      description:
        "Our pastry team will review your brief and reach out within 24–48 hours.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      orderType: "",
      servingSize: "",
      flavors: "",
      decorations: "",
      budget: "",
      allergies: "",
      description: "",
    });
    setDeliveryDate(undefined);
    setUploadedFiles([]);
    setIsSubmitting(false);
  };

  const specialtyCategories = [
    {
      id: "custom-cakes",
      title: "Custom Cakes",
      tagline: "Life's milestones, rendered in sugar & craft.",
      description: "Bespoke celebration cakes designed for life's milestones.",
      icon: <Gift className="h-5 w-5" />,
      features: [
        "Multi-tier architecture",
        "Signature flavor pairings",
        "Intricate fondant & buttercream",
        "Thematic coordination",
      ],
      leadTime: "7 – 14 days",
      priceRange: "$150 – $800+",
    },
    {
      id: "wedding-cakes",
      title: "Wedding Cakes",
      tagline: "The centrepiece of your most cherished day.",
      description: "Elegant, unforgettable centrepieces for your special day.",
      icon: <Heart className="h-5 w-5" />,
      features: [
        "Private tasting sessions",
        "Fresh floral arrangements",
        "Delivery & venue setup",
        "Anniversary tier included",
      ],
      leadTime: "3 – 6 months",
      priceRange: "$500 – $2,500+",
    },
    {
      id: "specialty-breads",
      title: "Artisan Breads",
      tagline: "Hand-crafted loaves, baked to your brief.",
      description: "Hand-crafted loaves baked to your exact specifications.",
      icon: <ChefHat className="h-5 w-5" />,
      features: [
        "Heritage grain selection",
        "Custom scoring patterns",
        "Dietary adaptations (GF/Vegan)",
        "Wholesale sizing available",
      ],
      leadTime: "3 – 7 days",
      priceRange: "$25 – $150+",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#faf6f0",
        color: "#1a0f07",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Inject custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .bakery-page {
          font-family: 'DM Sans', sans-serif;
          color: #1a0f07;
          background-color: #faf6f0;
        }
        .font-display {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .hero-line {
          background: linear-gradient(135deg, #2c1a0e 0%, #7a4f32 50%, #c4924a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tab-trigger-active {
          background: #2c1a0e !important;
          color: #f5ede3 !important;
          border-color: #2c1a0e !important;
        }
        .form-card {
          background: #fffcf8;
          border: 1px solid #e8e0d5;
        }
        .process-line::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 100%;
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, #d0c5b8, transparent);
          transform: translateX(-50%);
        }
        .upload-zone {
          border: 1px dashed #c8b8a5;
          background: #faf6f0;
          transition: all 0.25s ease;
        }
        .upload-zone:hover {
          border-color: #2c1a0e;
          background: #f5ede3;
        }
        .submit-btn {
          background: #2c1a0e;
          color: #f5ede3;
          letter-spacing: 0.12em;
          transition: all 0.3s ease;
        }
        .submit-btn:hover:not(:disabled) {
          background: #1a0f07;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(44,26,14,0.25);
        }
        .submit-btn:disabled {
          opacity: 0.6;
        }
        .ornament {
          display: inline-block;
          opacity: 0.35;
        }
        .section-rule {
          border: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, #c8b8a5 30%, #c8b8a5 70%, transparent);
        }
      `}</style>

      <Header />

      <main className="bakery-page flex-1">
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #fdf8f2 0%, #f5ede3 50%, #ede0d0 100%)",
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Decorative background shapes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              style={{
                position: "absolute",
                top: "-10%",
                right: "-5%",
                width: "45vw",
                height: "45vw",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(196,146,74,0.12) 0%, transparent 70%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "-8%",
                width: "35vw",
                height: "35vw",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(44,26,14,0.06) 0%, transparent 70%)",
              }}
            />
            {/* Thin vertical rule */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "10%",
                bottom: "10%",
                width: "1px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(200,184,165,0.4) 40%, rgba(200,184,165,0.4) 60%, transparent)",
                display: "none",
              }}
              className="lg:block"
            />
          </div>

          <div className="relative z-10 w-full">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-20 lg:py-32">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Left: Copy */}
                <div className="space-y-8 lg:space-y-10">
                  <div className="space-y-2">
                    <p
                      className="text-xs tracking-[0.3em] uppercase font-medium"
                      style={{
                        color: "#9a7a5a",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      ✦ Artisan Custom Creations
                    </p>
                    <h1
                      className="font-display hero-line"
                      style={{
                        fontSize: "clamp(3rem, 7vw, 6rem)",
                        lineHeight: 1.05,
                        fontWeight: 300,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Bring Your
                      <br />
                      <em style={{ fontStyle: "italic" }}>Culinary Vision</em>
                      <br />
                      to Life
                    </h1>
                  </div>

                  <p
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "#5a3f2a",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      maxWidth: "420px",
                    }}
                  >
                    From bespoke wedding centrepieces to artisan specialty
                    breads, our master bakers craft unique goods meticulously
                    tailored to your occasion.
                  </p>

                  {/* Stats strip */}
                  <div className="flex flex-wrap gap-8 pt-4">
                    {[
                      { value: "2,400+", label: "Cakes crafted" },
                      { value: "98%", label: "Client satisfaction" },
                      { value: "12 yrs", label: "Of mastery" },
                    ].map((stat) => (
                      <div key={stat.value} className="space-y-0.5">
                        <p
                          className="font-display"
                          style={{
                            fontSize: "2rem",
                            fontWeight: 300,
                            color: "#2c1a0e",
                            lineHeight: 1,
                          }}
                        >
                          {stat.value}
                        </p>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            color: "#9a7a5a",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      className="submit-btn inline-flex items-center justify-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-medium rounded-none"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      onClick={() =>
                        document
                          .getElementById("order-form")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Request a Quote
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-medium border rounded-none transition-all duration-300 hover:bg-[#2c1a0e] hover:text-[#f5ede3]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        borderColor: "#2c1a0e",
                        color: "#2c1a0e",
                        background: "transparent",
                      }}
                      onClick={() =>
                        document
                          .getElementById("portfolio")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      View Gallery
                    </button>
                  </div>
                </div>

                {/* Right: Feature cards */}
                <div className="hidden lg:grid grid-rows-3 gap-4">
                  {[
                    {
                      icon: "✦",
                      label: "Private Consultation",
                      sub: "One-on-one session with your dedicated pastry artist",
                    },
                    {
                      icon: "◈",
                      label: "Handcrafted to Brief",
                      sub: "Every element is made from scratch, exactly to your vision",
                    },
                    {
                      icon: "✧",
                      label: "White-Glove Delivery",
                      sub: "Venue setup and presentation included for large orders",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-5 p-6"
                      style={{
                        background:
                          i === 1 ? "#2c1a0e" : "rgba(255,252,248,0.8)",
                        border: `1px solid ${i === 1 ? "#2c1a0e" : "#e8e0d5"}`,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.4rem",
                          color: i === 1 ? "#c4924a" : "#c4924a",
                          lineHeight: 1,
                          marginTop: "2px",
                        }}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            color: i === 1 ? "#f5ede3" : "#1a0f07",
                            fontFamily: "'DM Sans', sans-serif",
                            marginBottom: "4px",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: i === 1 ? "#d0b896" : "#8a7060",
                            fontFamily: "'DM Sans', sans-serif",
                            lineHeight: 1.6,
                          }}
                        >
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-4">
          <hr className="section-rule" />
        </div>

        {/* ── Offerings ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase font-medium mb-3"
                  style={{
                    color: "#9a7a5a",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Our Specialties
                </p>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                    fontWeight: 300,
                    color: "#1a0f07",
                    lineHeight: 1.1,
                  }}
                >
                  Masterful <em>Offerings</em>
                </h2>
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#5a3f2a",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.7,
                  maxWidth: "380px",
                  fontWeight: 300,
                }}
              >
                Select a category to explore timelines, pricing, and everything
                included in your bespoke package.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap gap-3 bg-transparent p-0 mb-10 h-auto">
                {specialtyCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className={cn(
                      "flex items-center gap-2.5 px-6 py-3 border transition-all duration-300 rounded-none text-sm font-medium h-auto",
                      "data-[state=active]:bg-[#2c1a0e] data-[state=active]:text-[#f5ede3] data-[state=active]:border-[#2c1a0e]",
                      "data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#4a3728] data-[state=inactive]:border-[#d0c5b8] data-[state=inactive]:hover:border-[#2c1a0e]",
                    )}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {category.icon}
                    <span>{category.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {specialtyCategories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in duration-300"
                >
                  <div
                    className="grid lg:grid-cols-5 overflow-hidden"
                    style={{ border: "1px solid #e8e0d5" }}
                  >
                    {/* Left panel */}
                    <div
                      className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-between gap-8"
                      style={{ background: "#2c1a0e" }}
                    >
                      <div className="space-y-4">
                        <div
                          className="h-12 w-12 flex items-center justify-center"
                          style={{
                            background: "rgba(196,146,74,0.2)",
                            color: "#c4924a",
                          }}
                        >
                          {category.icon}
                        </div>
                        <h3
                          className="font-display"
                          style={{
                            fontSize: "2.2rem",
                            fontWeight: 300,
                            color: "#f5ede3",
                            lineHeight: 1.1,
                          }}
                        >
                          <em>{category.title}</em>
                        </h3>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#c4a880",
                            fontFamily: "'DM Sans', sans-serif",
                            lineHeight: 1.7,
                            fontWeight: 300,
                          }}
                        >
                          {category.description}
                        </p>
                      </div>

                      <div
                        className="grid grid-cols-2 gap-px"
                        style={{ border: "1px solid rgba(196,146,74,0.25)" }}
                      >
                        {[
                          {
                            icon: <Clock className="h-4 w-4" />,
                            label: "Lead Time",
                            value: category.leadTime,
                          },
                          {
                            icon: <CreditCard className="h-4 w-4" />,
                            label: "Investment",
                            value: category.priceRange,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="p-5"
                            style={{ background: "rgba(255,252,248,0.04)" }}
                          >
                            <div
                              style={{ color: "#c4924a", marginBottom: "8px" }}
                            >
                              {item.icon}
                            </div>
                            <p
                              style={{
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                color: "#9a7a6a",
                                fontFamily: "'DM Sans', sans-serif",
                                marginBottom: "4px",
                              }}
                            >
                              {item.label}
                            </p>
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "#f5ede3",
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 400,
                              }}
                            >
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right panel */}
                    <div
                      className="lg:col-span-3 p-8 lg:p-12"
                      style={{ background: "#fffcf8" }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <Star
                          className="h-4 w-4"
                          style={{ color: "#c4924a" }}
                        />
                        <span
                          style={{
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.25em",
                            color: "#9a7a5a",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          Your experience includes
                        </span>
                        <div
                          className="flex-1 h-px"
                          style={{ background: "#e8e0d5" }}
                        />
                      </div>

                      <ul className="space-y-5">
                        {category.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <CheckCircle
                              className="h-4 w-4 shrink-0 mt-0.5"
                              style={{ color: "#c4924a" }}
                            />
                            <span
                              style={{
                                fontSize: "0.9rem",
                                color: "#3a2518",
                                fontFamily: "'DM Sans', sans-serif",
                                lineHeight: 1.6,
                              }}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div
                        className="mt-10 pt-8"
                        style={{ borderTop: "1px solid #e8e0d5" }}
                      >
                        <Badge
                          variant="outline"
                          className="rounded-none text-xs tracking-widest uppercase"
                          style={{
                            borderColor: "#c4924a",
                            color: "#7a4f32",
                            fontFamily: "'DM Sans', sans-serif",
                            background: "rgba(196,146,74,0.06)",
                          }}
                        >
                          Fully Customisable
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pb-4">
          <hr className="section-rule" />
        </div>

        {/* ── Order Form ── */}
        <section
          id="order-form"
          className="py-20 lg:py-28"
          style={{ background: "#f7f1e8" }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-10">
                <div className="space-y-4 lg:sticky lg:top-8">
                  <p
                    className="text-xs tracking-[0.3em] uppercase font-medium"
                    style={{
                      color: "#9a7a5a",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Order Consultation
                  </p>
                  <h2
                    className="font-display"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3.2rem)",
                      fontWeight: 300,
                      color: "#1a0f07",
                      lineHeight: 1.1,
                    }}
                  >
                    Initiate Your <em>Request</em>
                  </h2>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#5a3f2a",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    Provide your brief below. A dedicated pastry consultant will
                    review your details and reach out within 24–48 hours.
                  </p>

                  {/* Process steps */}
                  <div className="space-y-5 pt-4">
                    {[
                      {
                        num: "01",
                        title: "Submit your brief",
                        sub: "Fill in the form with your event details",
                      },
                      {
                        num: "02",
                        title: "Consultation call",
                        sub: "We connect to discuss vision and feasibility",
                      },
                      {
                        num: "03",
                        title: "Bespoke quote",
                        sub: "Receive a detailed proposal within 48hrs",
                      },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span
                          className="font-mono text-xs font-bold"
                          style={{ color: "#c4924a", minWidth: "2rem" }}
                        >
                          {step.num}
                        </span>
                        <div>
                          <p
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 500,
                              color: "#1a0f07",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {step.title}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#8a7060",
                              fontFamily: "'DM Sans', sans-serif",
                              lineHeight: 1.6,
                            }}
                          >
                            {step.sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Trust badges */}
                  <div
                    className="pt-4 space-y-3"
                    style={{ borderTop: "1px solid #d0c5b8" }}
                  >
                    {[
                      "Secure, confidential inquiry",
                      "No commitment to quote",
                      "Flexible payment plans available",
                    ].map((trust) => (
                      <div key={trust} className="flex items-center gap-2.5">
                        <Sparkles
                          className="h-3.5 w-3.5"
                          style={{ color: "#c4924a" }}
                        />
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#7a5a40",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {trust}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Block 1 */}
                  <div className="form-card">
                    <StepHeader
                      number={1}
                      title="Contact Information"
                      subtitle="Your personal details for our consultant to reach you"
                    />
                    <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <FormField id="name" label="Full Name" required>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Jane Doe"
                          required
                          className={inputClass}
                        />
                      </FormField>
                      <FormField id="email" label="Email Address" required>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jane@example.com"
                          required
                          className={inputClass}
                        />
                      </FormField>
                      <FormField
                        id="phone"
                        label="Phone Number"
                        required
                        className="sm:col-span-2"
                      >
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          required
                          className={inputClass}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Block 2 */}
                  <div className="form-card">
                    <StepHeader
                      number={2}
                      title="Logistics & Scale"
                      subtitle="Help us understand the scope of your order"
                    />
                    <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <FormField
                        id="orderType"
                        label="Primary Request"
                        required
                      >
                        <Input
                          id="orderType"
                          name="orderType"
                          value={formData.orderType}
                          onChange={handleInputChange}
                          placeholder="e.g. 3-Tier Wedding Cake"
                          required
                          className={inputClass}
                        />
                      </FormField>
                      <FormField id="date" label="Target Date" required>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full h-12 justify-start text-left font-normal rounded-none border-0 border-b px-0 focus-visible:ring-0 transition-colors duration-200 text-sm",
                                deliveryDate
                                  ? "text-[#1a0f07] border-[#2c1a0e]"
                                  : "text-[#bfb0a0] border-[#d0c5b8] hover:border-[#2c1a0e]",
                              )}
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                background: "transparent",
                              }}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {deliveryDate ? (
                                format(deliveryDate, "PPP")
                              ) : (
                                <span>Select a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={deliveryDate}
                              onSelect={setDeliveryDate}
                              initialFocus
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </FormField>
                      <FormField
                        id="servingSize"
                        label="Guest Count / Serving Size"
                      >
                        <Input
                          id="servingSize"
                          name="servingSize"
                          value={formData.servingSize}
                          onChange={handleInputChange}
                          placeholder="e.g. 150 guests"
                          className={inputClass}
                        />
                      </FormField>
                      <FormField id="budget" label="Estimated Budget ($)">
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="e.g. $500 – $800"
                          className={inputClass}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Block 3 */}
                  <div className="form-card">
                    <StepHeader
                      number={3}
                      title="Creative Direction"
                      subtitle="Share your vision so we can begin planning"
                    />
                    <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <FormField id="flavors" label="Flavour Profile Ideas">
                          <Input
                            id="flavors"
                            name="flavors"
                            value={formData.flavors}
                            onChange={handleInputChange}
                            placeholder="e.g. Earl Grey sponge, Lemon curd"
                            className={inputClass}
                          />
                        </FormField>
                        <FormField
                          id="allergies"
                          label="Dietary Restrictions"
                          hint={<Info className="h-3.5 w-3.5 text-[#bfb0a0]" />}
                        >
                          <Input
                            id="allergies"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleInputChange}
                            placeholder="e.g. Celiac friendly, Nut-free"
                            className={inputClass}
                          />
                        </FormField>
                      </div>

                      <FormField
                        id="description"
                        label="Detailed Vision"
                        required
                      >
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the occasion, themes, colour palettes, and the overall aesthetic you are trying to achieve..."
                          rows={5}
                          required
                          className="rounded-none border-0 border-b border-[#d0c5b8] bg-transparent focus-visible:ring-0 focus-visible:border-[#2c1a0e] placeholder:text-[#bfb0a0] text-[#1a0f07] text-sm px-0 resize-none transition-colors duration-200"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                      </FormField>

                      {/* Upload zone */}
                      <div className="space-y-4 pt-2">
                        <p
                          className="text-xs font-semibold uppercase tracking-widest"
                          style={{
                            color: "#4a3728",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          Reference Material{" "}
                          <span style={{ color: "#9a7a5a", fontWeight: 400 }}>
                            (Optional)
                          </span>
                        </p>
                        <div
                          className="upload-zone p-10 text-center cursor-pointer"
                          onClick={() =>
                            !uploadedFiles.length || uploadedFiles.length < 5
                              ? document.getElementById("file-upload")?.click()
                              : undefined
                          }
                        >
                          <div
                            className="h-12 w-12 flex items-center justify-center mx-auto mb-4"
                            style={{
                              background: "#fffcf8",
                              border: "1px solid #e8e0d5",
                            }}
                          >
                            <Upload
                              className="h-5 w-5"
                              style={{ color: "#9a7a5a" }}
                            />
                          </div>
                          <p
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              color: "#2c1a0e",
                              fontFamily: "'DM Sans', sans-serif",
                              marginBottom: "6px",
                            }}
                          >
                            Drop moodboards or inspiration photos
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#9a7a5a",
                              fontFamily: "'DM Sans', sans-serif",
                              marginBottom: "20px",
                            }}
                          >
                            PNG, JPG, WEBP — max 5MB per file, up to 5 files
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            disabled={uploadedFiles.length >= 5}
                          />
                          <button
                            type="button"
                            disabled={uploadedFiles.length >= 5}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("file-upload")?.click();
                            }}
                            className="submit-btn inline-flex items-center gap-2 px-6 py-2.5 text-xs tracking-widest uppercase font-medium disabled:opacity-40"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Browse Device
                          </button>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p
                              style={{
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                color: "#9a7a5a",
                                fontFamily: "'DM Sans', sans-serif",
                              }}
                            >
                              Attached ({uploadedFiles.length}/5)
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between px-4 py-3"
                                  style={{
                                    background: "#fffcf8",
                                    border: "1px solid #e8e0d5",
                                  }}
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <Camera
                                      className="h-4 w-4 shrink-0"
                                      style={{ color: "#9a7a5a" }}
                                    />
                                    <span
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#1a0f07",
                                        fontFamily: "'DM Sans', sans-serif",
                                      }}
                                      className="truncate"
                                    >
                                      {file.name}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="ml-3 shrink-0 p-1 hover:opacity-60 transition-opacity"
                                  >
                                    <X
                                      className="h-3.5 w-3.5"
                                      style={{ color: "#9a7a5a" }}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit area */}
                      <div
                        className="pt-8 flex flex-col items-center gap-4"
                        style={{ borderTop: "1px solid #e8e0d5" }}
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="submit-btn w-full sm:w-auto min-w-[280px] flex items-center justify-center gap-3 px-10 py-4 text-sm tracking-widest uppercase font-medium"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-[#f5ede3] border-t-transparent rounded-full animate-spin" />
                              Processing…
                            </>
                          ) : (
                            <>
                              Submit Order Inquiry
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "#9a7a5a",
                            fontFamily: "'DM Sans', sans-serif",
                            textAlign: "center",
                          }}
                        >
                          By submitting you agree to our{" "}
                          <a
                            href="#"
                            style={{
                              color: "#2c1a0e",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            custom order terms
                          </a>
                          . Quotes are valid for 14 days.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
