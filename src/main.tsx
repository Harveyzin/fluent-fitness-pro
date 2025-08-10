import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WorkoutProvider } from "./contexts/WorkoutContext.tsx";
import { NutritionProvider } from "./contexts/NutritionContext.tsx";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";
import { TrainerProvider } from "./contexts/TrainerContext.tsx";
import { BioimpedanceProvider } from "./contexts/BioimpedanceContext.tsx";
import { ProgressProvider } from "./contexts/ProgressContext.tsx";

createRoot(document.getElementById("root")!).render(
  <WorkoutProvider>
    <NutritionProvider>
      <SettingsProvider>
        <TrainerProvider>
          <BioimpedanceProvider>
            <ProgressProvider>
              <App />
            </ProgressProvider>
          </BioimpedanceProvider>
        </TrainerProvider>
      </SettingsProvider>
    </NutritionProvider>
  </WorkoutProvider>
);
