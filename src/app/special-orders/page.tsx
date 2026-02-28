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
  ChevronRight,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Limit to 5 files, each under 5MB (Enterprise standard validation)
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      toast({
        title: "File too large",
        description:
          "Some files were skipped because they exceed the 5MB limit.",
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

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Order Request Received!",
      description:
        "Our pastry team will review your details and contact you within 24-48 hours.",
    });

    // Reset Form
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

  // --- Static Data ---
  const specialtyCategories = [
    {
      id: "custom-cakes",
      title: "Custom Cakes",
      description: "Bespoke celebration cakes designed for life's milestones.",
      icon: <Gift className="h-6 w-6" />,
      features: [
        "Multi-tier architecture",
        "Signature flavor pairings",
        "Intricate fondant & buttercream",
        "Thematic coordination",
      ],
      leadTime: "7-14 days",
      priceRange: "$150 - $800+",
    },
    {
      id: "wedding-cakes",
      title: "Wedding Cakes",
      description: "Elegant, unforgettable centerpieces for your special day.",
      icon: <Heart className="h-6 w-6" />,
      features: [
        "Private tasting sessions",
        "Fresh floral arrangements",
        "Delivery & venue setup",
        "Anniversary tier included",
      ],
      leadTime: "3-6 months",
      priceRange: "$500 - $2500+",
    },
    {
      id: "specialty-breads",
      title: "Artisan Breads",
      description: "Hand-crafted loaves baked to your exact specifications.",
      icon: <ChefHat className="h-6 w-6" />,
      features: [
        "Heritage grain selection",
        "Custom scoring patterns",
        "Dietary adaptations (GF/Vegan)",
        "Wholesale sizing available",
      ],
      leadTime: "3-7 days",
      priceRange: "$25 - $150+",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative py-28 lg:py-36 overflow-hidden border-b border-border/40 bg-zinc-50 dark:bg-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="px-5 py-2 text-sm font-medium rounded-full bg-background/80 backdrop-blur-sm shadow-sm border-primary/20"
              >
                ✨ Artisan Custom Creations
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Bring Your <br className="hidden sm:block" />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Culinary Vision to Life
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                From bespoke wedding centerpieces to artisan specialty breads,
                our master bakers craft unique goods meticulously tailored to
                your occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  className="px-8 text-base h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={() =>
                    document
                      .getElementById("order-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Request a Quote
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-base h-14 rounded-full bg-background"
                  onClick={() =>
                    document
                      .getElementById("portfolio")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore the Gallery
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* --- Categories Section --- */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Masterful Offerings
              </h2>
              <p className="text-muted-foreground text-lg">
                Select a category to understand our timelines, pricing
                structure, and what is included in your custom package.
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="max-w-5xl mx-auto"
            >
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-4 bg-transparent p-0 mb-8">
                {specialtyCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 py-5 px-6 rounded-2xl border border-border bg-card data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300 hover:bg-muted/50"
                  >
                    <div className="p-2 rounded-full bg-muted data-[state=active]:bg-primary/10">
                      {category.icon}
                    </div>
                    <span className="font-semibold text-lg">
                      {category.title}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {specialtyCategories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-2 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in zoom-in-95 duration-300"
                >
                  <Card className="border-border shadow-lg overflow-hidden rounded-3xl">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-8 pt-10 px-10">
                      <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                        <div>
                          <CardTitle className="text-3xl font-bold">
                            {category.title}
                          </CardTitle>
                          <CardDescription className="text-lg mt-2">
                            {category.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-sm py-1.5 px-4 rounded-full"
                        >
                          Fully Customizable
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Clock className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                Standard Lead Time
                              </h4>
                              <p className="text-muted-foreground">
                                {category.leadTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">
                                Investment Range
                              </h4>
                              <p className="text-muted-foreground">
                                {category.priceRange}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
                            <Star className="h-5 w-5 text-primary fill-primary/20" />
                            Experience Includes
                          </h4>
                          <ul className="space-y-3">
                            {category.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-muted-foreground"
                              >
                                <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* --- Order Form Section --- */}
        <section
          id="order-form"
          className="py-24 bg-zinc-50 dark:bg-zinc-950 border-y border-border/40"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Initiate Your Order
                </h2>
                <p className="text-lg text-muted-foreground">
                  Provide us with the foundational details of your event. A
                  dedicated pastry consultant will review your brief.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Block 1: Contact Details */}
                <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      1
                    </span>
                    <h3 className="text-lg font-semibold">
                      Contact Information
                    </h3>
                  </div>
                  <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-foreground"
                      >
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-foreground"
                      >
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2.5 md:col-span-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-foreground"
                      >
                        Phone Number <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        required
                        className="h-11"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Block 2: Order Specifications */}
                <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      2
                    </span>
                    <h3 className="text-lg font-semibold">Logistics & Scale</h3>
                  </div>
                  <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label
                        htmlFor="orderType"
                        className="text-sm font-semibold text-foreground"
                      >
                        Primary Request{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="orderType"
                        name="orderType"
                        value={formData.orderType}
                        onChange={handleInputChange}
                        placeholder="e.g., 3-Tier Wedding Cake"
                        required
                        className="h-11"
                      />
                    </div>

                    {/* Enterpise Grade Shadcn Date Picker */}
                    <div className="space-y-2.5 flex flex-col justify-end">
                      <label className="text-sm font-semibold text-foreground">
                        Target Date <span className="text-destructive">*</span>
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal border-input bg-background hover:bg-accent hover:text-accent-foreground",
                              !deliveryDate && "text-muted-foreground",
                            )}
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
                              date < new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2.5">
                      <label
                        htmlFor="servingSize"
                        className="text-sm font-semibold text-foreground"
                      >
                        Guest Count / Serving Size
                      </label>
                      <Input
                        id="servingSize"
                        name="servingSize"
                        value={formData.servingSize}
                        onChange={handleInputChange}
                        placeholder="e.g., 150 guests"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label
                        htmlFor="budget"
                        className="text-sm font-semibold text-foreground"
                      >
                        Estimated Budget ($)
                      </label>
                      <Input
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g., $500 - $800"
                        className="h-11"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Block 3: Creative Direction */}
                <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      3
                    </span>
                    <h3 className="text-lg font-semibold">
                      Creative Direction
                    </h3>
                  </div>
                  <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label
                          htmlFor="flavors"
                          className="text-sm font-semibold text-foreground"
                        >
                          Flavor Profile Ideas
                        </label>
                        <Input
                          id="flavors"
                          name="flavors"
                          value={formData.flavors}
                          onChange={handleInputChange}
                          placeholder="e.g., Earl Grey sponge with Lemon"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <label
                          htmlFor="allergies"
                          className="text-sm font-semibold text-foreground flex items-center justify-between"
                        >
                          Dietary Restrictions
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </label>
                        <Input
                          id="allergies"
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleInputChange}
                          placeholder="e.g., Celiac friendly, Nut-free facility required"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label
                        htmlFor="description"
                        className="text-sm font-semibold text-foreground"
                      >
                        Detailed Vision{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the occasion, themes, color palettes, and overall aesthetic you are trying to achieve..."
                        rows={5}
                        required
                        className="resize-none bg-background focus-visible:ring-primary/20"
                      />
                    </div>

                    {/* Elevated File Upload */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <label className="text-sm font-semibold text-foreground block">
                        Reference Material (Optional)
                      </label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center bg-muted/10 transition-colors hover:bg-muted/30 group">
                        <div className="h-12 w-12 bg-background shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                          <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Drag and drop moodboards or inspiration photos
                        </p>
                        <p className="text-xs text-muted-foreground mb-6">
                          Supports PNG, JPG, WEBP (Max 5MB per file, up to 5
                          files)
                        </p>

                        <input
                          type="file"
                          multiple
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          disabled={uploadedFiles.length >= 5}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={uploadedFiles.length >= 5}
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                        >
                          Browse Device
                        </Button>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-6 space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Attached Files ({uploadedFiles.length}/5)
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-background border border-border px-4 py-3 rounded-lg shadow-sm"
                              >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                  <Camera className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="text-sm truncate font-medium">
                                    {file.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="bg-muted/30 border-t border-border p-6 md:p-8 flex flex-col items-center">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto min-w-[250px] h-14 text-base rounded-full shadow-md"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing Request..."
                        : "Submit Order Inquiry"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      By submitting, you agree to our{" "}
                      <a
                        href="#"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        custom order terms and conditions
                      </a>
                      . Quotes are valid for 14 days.
                    </p>
                  </CardFooter>
                </Card>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
