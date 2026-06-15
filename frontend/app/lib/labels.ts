// Maps the dive-site difficulty enum (stored in English) to Arabic for display.
export function difficultyAr(value?: string): string {
  switch (value) {
    case "Beginner":
      return "مبتدئ";
    case "Intermediate":
      return "متوسط";
    case "Advanced":
      return "متقدّم";
    default:
      return value || "";
  }
}
