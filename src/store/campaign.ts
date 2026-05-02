import { create } from "zustand";
import type { CampaignState, WorkflowStep, Platform, AssetType, Format, CampaignAnalysis, CreativeBrief, UploadedAsset, GeneratedAsset } from "@/types/campaign";

interface CampaignStore extends CampaignState {
  setStep: (step: WorkflowStep) => void;
  setIdea: (idea: string) => void;
  setAnalysis: (analysis: CampaignAnalysis) => void;
  togglePlatform: (p: Platform) => void;
  toggleAssetType: (a: AssetType) => void;
  toggleFormat: (f: Format) => void;
  setBrief: (brief: CreativeBrief) => void;
  addUploadedAsset: (asset: UploadedAsset) => void;
  setGeneratedAssets: (assets: GeneratedAsset[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initial: CampaignState = {
  step: "idea",
  idea: "",
  analysis: null,
  selectedPlatforms: [],
  selectedAssetTypes: [],
  selectedFormats: [],
  brief: null,
  uploadedAssets: [],
  generatedAssets: [],
  isLoading: false,
  error: null,
};

export const useCampaignStore = create<CampaignStore>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setIdea: (idea) => set({ idea }),
  setAnalysis: (analysis) => set({ analysis }),
  togglePlatform: (p) =>
    set((s) => ({
      selectedPlatforms: s.selectedPlatforms.includes(p)
        ? s.selectedPlatforms.filter((x) => x !== p)
        : [...s.selectedPlatforms, p],
    })),
  toggleAssetType: (a) =>
    set((s) => ({
      selectedAssetTypes: s.selectedAssetTypes.includes(a)
        ? s.selectedAssetTypes.filter((x) => x !== a)
        : [...s.selectedAssetTypes, a],
    })),
  toggleFormat: (f) =>
    set((s) => ({
      selectedFormats: s.selectedFormats.some((x) => x.id === f.id)
        ? s.selectedFormats.filter((x) => x.id !== f.id)
        : [...s.selectedFormats, f],
    })),
  setBrief: (brief) => set({ brief }),
  addUploadedAsset: (asset) =>
    set((s) => ({ uploadedAssets: [...s.uploadedAssets, asset] })),
  setGeneratedAssets: (generatedAssets) => set({ generatedAssets }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initial),
}));
