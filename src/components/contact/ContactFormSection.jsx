"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/lib/site";

const locationOptionMap = {
  "white-horse-inn-launceston": "White Horse Inn, Launceston",
};

const enquiryOptions = [
  "General Enquiry",
  "Table Booking Enquiry",
  "Accommodation Enquiry",
  "Function Room Enquiry",
  ...Object.values(locationOptionMap),
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "",
  message: "",
  companyWebsite: "", // honeypot
};

export default function ContactFormSection() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const locationParam = searchParams.get("location");
  const enquiryTypeParam = searchParams.get("enquiryType") || searchParams.get("enquiry");

  const prefilledEnquiryType = useMemo(() => {
    if (enquiryTypeParam && enquiryOptions.includes(enquiryTypeParam)) {
      return enquiryTypeParam;
    }

    if (!locationParam) return "";
    return locationOptionMap[locationParam] || "";
  }, [enquiryTypeParam, locationParam]);

  const selectedEnquiryType = formData.enquiryType || prefilledEnquiryType;

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          enquiryType: selectedEnquiryType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data?.error || "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Thanks — your message has been sent successfully.",
      });

      setFormData({
        ...initialForm,
        enquiryType: prefilledEnquiryType || "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative z-20 bg-[color:var(--color-surface)] pb-24 pt-8 md:pb-32 md:pt-10">
      <div className="site-container px-2">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <Card className="border border-[color:var(--color-primary)]/20 bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
            <CardHeader className="space-y-3 border-b border-[color:var(--color-border-soft)] pb-6">
              <p className="eyebrow">Enquiry Form</p>
              <CardTitle className="font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
                Contact White Horse Inn
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-7 text-[color:var(--color-copy-soft)]">
                Fill in the form below and we&apos;ll get your message to the
                right person as quickly as possible.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 md:pt-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--color-primary)]"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Your full name"
                      className="h-10 rounded-[1rem] border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="enquiryType"
                      className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--color-primary)]"
                    >
                      Type of Enquiry
                    </label>

                    <Select
                      value={selectedEnquiryType}
                      onValueChange={(value) =>
                        updateField("enquiryType", value)
                      }
                    >
                      <SelectTrigger
                        id="enquiryType"
                        className="h-10 w-full rounded-[1rem] border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4"
                      >
                        <SelectValue placeholder="Select an enquiry type" />
                      </SelectTrigger>

                      <SelectContent>
                        {enquiryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--color-primary)]"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      className="h-10 rounded-[1rem] border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--color-primary)]"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Optional phone number"
                      className="h-10 rounded-[1rem] border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-extrabold tracking-[0.02em] text-[color:var(--color-primary)]"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    placeholder="Tell us a little more about your enquiry..."
                    className="min-h-[120px] rounded-[1rem] border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4 py-3"
                    required
                  />
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="companyWebsite">Company Website</label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.companyWebsite}
                    onChange={(event) =>
                      updateField("companyWebsite", event.target.value)
                    }
                  />
                </div>

                {status.message ? (
                  <div
                    className={`rounded-[1rem] border px-4 py-3 text-sm font-semibold ${
                      status.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {status.message}
                  </div>
                ) : null}

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    variant="brandCta"
                    size="hero"
                    className="w-full sm:w-auto sm:min-w-[18rem]"
                  >
                    {submitting ? "Sending..." : "Send Enquiry"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
