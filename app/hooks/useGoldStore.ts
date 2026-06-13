import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GoldState {
    rate21ct: string;
    rate24ct: string;
    ratePalladium: string;
    timestamp: number | null;
    setRate21ct: (rate: string) => void;
    setRate24ct: (rate: string) => void;
    setRatePalladium: (rate: string) => void;
}

export const useGoldStore = create<GoldState>()(
    persist(
        (set) => ({
            rate21ct: '',
            rate24ct: '',
            ratePalladium: '', // Initialize empty
            timestamp: null,
            setRate21ct: (rate) => set({ rate21ct: rate, timestamp: Date.now() }),
            setRate24ct: (rate) => set({ rate24ct: rate, timestamp: Date.now() }),
            setRatePalladium: (rate) => set({ ratePalladium: rate, timestamp: Date.now() }),
        }),
        {
            name: 'hamidullah_gold_store',
            storage: createJSONStorage(() => localStorage),

            migrate: (persistedState: any) => {
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                if (persistedState?.timestamp && Date.now() - persistedState.timestamp > TWENTY_FOUR_HOURS) {
                    // Reset everything if expired
                    return { rate21ct: '', rate24ct: '', ratePalladium: '', timestamp: null };
                }
                return persistedState;
            },
        }
    )
);