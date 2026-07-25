"use client";

interface PositionInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function PositionInput({ value, onChange }: PositionInputProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;
        const cleaned = raw.replace(/[^0-9]/g, "");
        if (Number(cleaned) > 20000)
            return;
        onChange(cleaned);
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
    }

    return (
        <input
            id="position-input"
            name="position-input"
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="8000"
            className="w-[9ch] rounded-xl bg-white px-3 py-2.5 text-center text-ink ring-1 ring-ink/[0.10] placeholder:text-ink-soft/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-accent"
        />
    );
}