import { Check } from "lucide-react";

export default function PremiumSignupProgress({
  currentStep,
  showEmailContent,
  subStep,
  settingsStep,
}) {

  let stepIndex = 0;

  if (!showEmailContent) stepIndex = 0;
  else if (currentStep === 0) stepIndex = 1;
  else if (currentStep === 1) stepIndex = subStep - 2;
  else if (currentStep === 2) stepIndex = settingsStep - 2;

  const steps = [
    "Account",
    "Verify",
    "Information",
    "Firm",
    "Services",
    "Settings",
    "Security",
  ];

  return (   // ✅ THIS WAS MISSING

    <div className="w-full mb-8">

      <div className="w-full flex items-center justify-between relative">

        {steps.map((label, index) => {

          const isCompleted = index < stepIndex;
          const isActive = index === stepIndex;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">

              {/* LINE */}
              {index !== 0 && (
                <div
                  className={`absolute top-5 -left-1/2 w-full h-[2px]
                  ${isCompleted ? "bg-slate-900" : "bg-slate-300"}`}
                />
              )}

              {/* CIRCLE */}
              <div
                className={`
                  relative z-10 flex items-center justify-center
                  w-10 h-10 rounded-full border-2 font-semibold

                  ${
                    isCompleted
                      ? "bg-slate-900 text-white border-slate-900"
                      : isActive
                      ? "border-slate-900 text-slate-900 bg-white"
                      : "border-slate-300 text-slate-400 bg-white"
                  }
                `}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>

              {/* LABEL */}
              <span
                className={`mt-2 text-sm font-medium
                ${isActive ? "text-slate-900" : "text-slate-400"}`}
              >
                {label}
              </span>

            </div>
          );
        })}

      </div>

    </div>

  );
}
