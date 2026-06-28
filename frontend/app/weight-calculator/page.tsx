import type { Metadata } from "next";
import WeightCalculator from "@/app/components/home/WeightCalculator";

export const metadata: Metadata = {
  title: "حاسبة وزن الحزام الرصاصي | ArabDiving",
  description:
    "احسب الوزن المثالي للحزام الرصاصي للوصول إلى التوازن المحايد تحت الماء — مبني على معايير PADI وSSI مع مراعاة نوع البدلة والأسطوانة ونوع الماء.",
  openGraph: {
    title: "حاسبة وزن الحزام الرصاصي | ArabDiving",
    description: "أداة تفاعلية لحساب وزن الرصاص المناسب لكل غوّاص",
    url: "https://arabdiving.com/weight-calculator",
  },
};

export default function WeightCalculatorPage() {
  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#08233e 0%,#0d2c54 55%,#2e75b6 100%)" }}>
      <WeightCalculator />
    </main>
  );
}
