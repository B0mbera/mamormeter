"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TOP_UNIVERSITIES, NON_STUDENT_ID, OTHER_ID } from "@/lib/universities";
import { containsProfanity } from "@/lib/profanity";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const setUserId = useUserStore((s) => s.setUserId);
  const { t } = useLanguageStore();

  const [name, setName] = useState("");
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [universityChoice, setUniversityChoice] = useState<string | null>(null);
  const [otherName, setOtherName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      toast.error(t("validation.nameRequired"));
      return;
    }
    if (name.trim().length > 20) {
      toast.error(t("validation.nameTooLong"));
      return;
    }
    if (containsProfanity(name)) {
      toast.error(t("validation.nameProfanity"));
      return;
    }
    if (!universityChoice) {
      toast.error(t("validation.universityRequired"));
      return;
    }

    let universityValue: string = universityChoice;
    if (universityChoice === OTHER_ID) {
      const trimmed = otherName.trim();
      if (!trimmed) {
        toast.error(t("validation.otherUniversityRequired"));
        return;
      }
      if (trimmed.length > 40) {
        toast.error(t("validation.otherUniversityTooLong"));
        return;
      }
      if (containsProfanity(trimmed)) {
        toast.error(t("validation.universityProfanity"));
        return;
      }
      universityValue = `${OTHER_ID}:${trimmed}`;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          weightKg: weight,
          gender,
          university: universityValue,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t("toast.error"));
        return;
      }

      const user = await res.json();
      setUserId(user.id);
      toast.success(t("toast.profileCreated"));
      router.push("/dashboard");
    } catch {
      toast.error(t("toast.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold">🎪 EFOTT Ivásszámláló</h1>
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
            EFOTT 2026 · Velencei-tó
          </p>
          <p className="text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label>{t("onboarding.name")}</Label>
              <Input
                placeholder={t("onboarding.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label>{t("onboarding.weight")}: {weight} kg</Label>
              <Slider
                min={30}
                max={250}
                step={1}
                value={[weight]}
                onValueChange={([v]) => setWeight(v)}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>{t("onboarding.gender")}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  onClick={() => setGender("male")}
                >
                  {t("onboarding.male")}
                </Button>
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                >
                  {t("onboarding.female")}
                </Button>
              </div>
            </div>

            {/* University selector */}
            <div className="space-y-2">
              <Label>{t("onboarding.university")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {TOP_UNIVERSITIES.map((u) => (
                  <Button
                    key={u.id}
                    type="button"
                    variant={universityChoice === u.id ? "default" : "outline"}
                    className="h-12 flex gap-2 items-center justify-start px-3"
                    style={
                      universityChoice === u.id
                        ? { backgroundColor: u.color, borderColor: u.color, color: "white" }
                        : { borderColor: u.color + "40" }
                    }
                    onClick={() => setUniversityChoice(u.id)}
                  >
                    <span className="text-base">{u.emoji}</span>
                    <span className="text-xs font-bold truncate">{u.shortName}</span>
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={universityChoice === NON_STUDENT_ID ? "default" : "outline"}
                  className="h-12 flex gap-2 items-center justify-start px-3"
                  onClick={() => setUniversityChoice(NON_STUDENT_ID)}
                >
                  <span className="text-base">🎒</span>
                  <span className="text-xs font-bold truncate">{t("onboarding.nonStudent")}</span>
                </Button>
                <Button
                  type="button"
                  variant={universityChoice === OTHER_ID ? "default" : "outline"}
                  className="h-12 flex gap-2 items-center justify-start px-3"
                  onClick={() => setUniversityChoice(OTHER_ID)}
                >
                  <span className="text-base">🏫</span>
                  <span className="text-xs font-bold truncate">{t("onboarding.other")}</span>
                </Button>
              </div>

              {universityChoice === OTHER_ID && (
                <Input
                  className="mt-2"
                  placeholder={t("onboarding.otherUniversityPlaceholder")}
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  maxLength={40}
                />
              )}
            </div>

            <Button
              className="w-full h-12 text-base"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t("onboarding.loading") : t("onboarding.submit")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
