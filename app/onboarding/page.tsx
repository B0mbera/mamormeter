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
import { UNIVERSITIES, isMedikus } from "@/lib/constants";
import { toast } from "sonner";
import Image from "next/image";

const EMOJIS = ["😎", "🤪", "🍻", "🎉", "🔥", "😂", "🥳", "💀", "👑", "🦄"];

export default function OnboardingPage() {
  const router = useRouter();
  const setUserId = useUserStore((s) => s.setUserId);
  const { locale, t } = useLanguageStore();
  const medikus = isMedikus();

  const [name, setName] = useState("");
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [emoji, setEmoji] = useState("🍻");
  const [university, setUniversity] = useState<string | null>(null);
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
    if (medikus && !university) {
      toast.error(t("validation.uniRequired"));
      return;
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
          emoji,
          university: medikus ? university : null,
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
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold">🍻 MámorMéter</h1>
          {medikus && (
            <p className="text-sm font-medium text-violet-600">
              53. Medikus Kupa · Pécs 2026
            </p>
          )}
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

            {/* Emoji picker */}
            <div className="space-y-2">
              <Label>{t("onboarding.emoji")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJIS.map((e) => (
                  <Button
                    key={e}
                    type="button"
                    variant={emoji === e ? "default" : "outline"}
                    size="sm"
                    className="h-9 w-9 text-lg p-0"
                    onClick={() => setEmoji(e)}
                  >
                    {e}
                  </Button>
                ))}
              </div>
            </div>

            {/* University selector (Medikus Kupa only) */}
            {medikus && (
              <div className="space-y-2">
                <Label>{t("onboarding.university")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {UNIVERSITIES.map((uni) => (
                    <Button
                      key={uni.id}
                      type="button"
                      variant={university === uni.id ? "default" : "outline"}
                      className="h-14 flex gap-2 items-center"
                      style={
                        university === uni.id
                          ? { backgroundColor: uni.color, borderColor: uni.color }
                          : { borderColor: uni.color + "40" }
                      }
                      onClick={() => setUniversity(uni.id)}
                    >
                      <Image
                        src={uni.logo}
                        alt={uni.name}
                        width={24}
                        height={24}
                        className="rounded-sm"
                      />
                      <span className="text-xs font-bold">{uni.id}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

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
