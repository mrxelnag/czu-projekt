"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateTimePickerProps = {
  value?: string;
  onChange?: (value?: string) => void;
  step?: number; // minutes granularity for time
  hideLabels?: boolean;
  idPrefix?: string;
  className?: string;
};

export function DateTimePicker({
  value,
  onChange,
  step = 5,
  hideLabels = false,
  idPrefix = "dt",
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<string>(""); // HH:MM

  // Initialize/sync from external value
  React.useEffect(() => {
    if (!value) {
      setDate(undefined);
      setTime("");
      return;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      setDate(undefined);
      setTime("");
      return;
    }
    setDate(d);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    setTime(`${hh}:${mm}`);
  }, [value]);

  function emitChange(nextDate: Date | undefined, nextTime: string) {
    if (!onChange) return;
    if (!nextDate || !nextTime) {
      onChange("");
      return;
    }
    // Build a Date from local components and emit a full ISO string (UTC) to satisfy backend ISO parsing
    const [hh, mm] = nextTime.split(":");
    const iso = new Date(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      nextDate.getDate(),
      Number(hh),
      Number(mm),
      0,
      0,
    ).toISOString();
    onChange(iso);
  }

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <div className="flex grow flex-col gap-3">
        {!hideLabels && (
          <Label htmlFor={`${idPrefix}-date`} className="px-1">
            Date
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${idPrefix}-date`}
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Vyberte datum"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
                emitChange(d as Date | undefined, time);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        {!hideLabels && (
          <Label htmlFor={`${idPrefix}-time`} className="px-1">
            Time
          </Label>
        )}
        <Input
          type="time"
          id={`${idPrefix}-time`}
          step={String(step * 60)}
          value={time}
          onChange={(e) => {
            const t = e.target.value;
            setTime(t);
            emitChange(date, t);
          }}
          placeholder="--:--"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
