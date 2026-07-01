import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GoldState {
    rate24ct: string;
    rate22ct: string;
    rate21ct: string;
    rate20ct: string;
    rate18ct: string;
    rate14ct: string;
    ratePalladium: string;
    rateSilver: string;
    ratePlatinum: string;
    timestamp: number | null;
    setRate24ct: (rate: string) => void;
    setRate22ct: (rate: string) => void;
    setRate21ct: (rate: string) => void;
    setRate20ct: (rate: string) => void;
    setRate18ct: (rate: string) => void;
    setRate14ct: (rate: string) => void;
    setRatePalladium: (rate: string) => void;
    setRateSilver: (rate: string) => void;
    setRatePlatinum: (rate: string) => void;
}

export const useGoldStore = create<GoldState>()(
    persist(
        (set) => ({
            rate24ct: '',
            rate22ct: '',
            rate21ct: '',
            rate20ct: '',
            rate18ct: '',
            rate14ct: '',
            ratePalladium: '',
            rateSilver: '',
            ratePlatinum: '',
            timestamp: null,
            setRate24ct: (rate) => set({ rate24ct: rate, timestamp: Date.now() }),
            setRate22ct: (rate) => set({ rate22ct: rate, timestamp: Date.now() }),
            setRate21ct: (rate) => set({ rate21ct: rate, timestamp: Date.now() }),
            setRate20ct: (rate) => set({ rate20ct: rate, timestamp: Date.now() }),
            setRate18ct: (rate) => set({ rate18ct: rate, timestamp: Date.now() }),
            setRate14ct: (rate) => set({ rate14ct: rate, timestamp: Date.now() }),
            setRatePalladium: (rate) => set({ ratePalladium: rate, timestamp: Date.now() }),
            setRateSilver: (rate) => set({ rateSilver: rate, timestamp: Date.now() }),
            setRatePlatinum: (rate) => set({ ratePlatinum: rate, timestamp: Date.now() }),
        }),
        {
            name: 'hamidullah_gold_store',
            storage: createJSONStorage(() => localStorage),

            migrate: (persistedState: any) => {
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                if (persistedState?.timestamp && Date.now() - persistedState.timestamp > TWENTY_FOUR_HOURS) {
                    // Clean reset mapping loop for expired states
                    return {
                        rate24ct: '',
                        rate22ct: '',
                        rate21ct: '',
                        rate20ct: '',
                        rate18ct: '',
                        rate14ct: '',
                        ratePalladium: '',
                        rateSilver: '',
                        ratePlatinum: '',
                        timestamp: null
                    };
                }
                return persistedState;
            },
        }
    )
);