import { getAllSchoolCoords } from "@/lib/db/schools";
import OnboardingClient from "@/components/OnboardingClient";

export default async function Onboarding() {
    const schools = await getAllSchoolCoords();
    return <OnboardingClient schools={schools} />;
}