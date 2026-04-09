import DotScaleFillCharBtn from "@/components/Buttons/PrimaryButtons/DotBgFillPrimaryBtn/DotBgFillPrimaryBtn";
import { ButtonDemoShell } from "@/components/Buttons/ButtonDemoShell";

export default function Page() {
  return (
    <ButtonDemoShell
      title="Dot Fill Button"
      backgroundSrc="/assets/buttonbg/primary-btn-bg.jpg"
    >
      <DotScaleFillCharBtn
        href="#"
        btnText="Hover me"
        bgColor="#ff6b00"
        textColor="#ffffff"
        fillColor="#ffffff"
        hoverTextColor="#ff6b00"
      />
    </ButtonDemoShell>
  );
}
