import { StateCreator } from "zustand";

export interface Location {
    label: string;
    lat: number;
    lon: number;
}

export interface SelectedLocationSlice {
    selectedLocation?: Location;
    setSelectedLocation: (location?: Location) => void;
}

// Tạo Zustand slice để lưu selectedLocation
const createSelectedLocationSlice: StateCreator<
    SelectedLocationSlice
> = set => ({
    selectedLocation: undefined,
    setSelectedLocation: (location?: Location) =>
        set({ selectedLocation: location }),
});

export default createSelectedLocationSlice;
